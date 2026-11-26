import type { CodingPulseData, ModelSlice, PulseDay, PulseTier } from '@/lib/tokens-ci/format'

import { PULSE_DAY_COUNT, TOKENS_CI_API_URL } from '@/lib/tokens-ci/format'

interface RawModelUsage {
	cost?: number
	messages?: number
	tokens?: number
}

interface RawClientEntry {
	client?: string
	models?: Record<string, RawModelUsage>
}

interface RawContribution {
	clients?: RawClientEntry[]
	date?: string
	totals?: {
		cost?: number
		messages?: number
		tokens?: number
	}
}

interface RawTokensCiResponse {
	chartRange?: {
		end?: string
	}
	contributions?: RawContribution[]
	stats?: {
		activeDays?: number
		totalCost?: number
		totalTokens?: number
	}
}

const CACHE_TTL_SECONDS = 600
const CACHE_TTL_MS = CACHE_TTL_SECONDS * 1000
const COLD_TIMEOUT_MS = 1800
const REFRESH_TIMEOUT_MS = 900
const CACHE_KEY_URL = 'https://tokens-ci.internal/v1/withxat'

const MODEL_SUFFIXES = new Set([
	'build',
	'extra',
	'fast',
	'high',
	'highspeed',
	'low',
	'max',
	'medium',
	'preview',
	'thinking',
	'xhigh',
])

const OTHER_KEY = '__other__'

let isolateCache: null | { at: number, data: CodingPulseData } = null
let inflightFetch: null | Promise<CodingPulseData | null> = null

function titleCase(word: string): string {
	return word ? word.charAt(0).toUpperCase() + word.slice(1) : ''
}

export function normalizeModelName(raw: string): string {
	let s = raw.toLowerCase().replace(/^.*\//, '').replace(/@.*$/, '').replace(/^cursor-/, '')
	if (s.startsWith('grok-bot'))
		return 'Grok Bot'

	const parts = s.split('-')
	while (parts.length > 1 && (MODEL_SUFFIXES.has(parts.at(-1)!) || /^\d{4}$/.test(parts.at(-1)!)))
		parts.pop()
	s = parts.join('-')

	let match = s.match(/^claude-(\d)-(\d)-(opus|sonnet|haiku)/)
	if (match)
		return `${titleCase(match[3]!)} ${match[1]}.${match[2]}`

	match = s.match(/^claude-(opus|sonnet|haiku|fable)-(\d)(?:-(\d))?$/)
	if (match)
		return `${titleCase(match[1]!)} ${match[2]}${match[3] ? `.${match[3]}` : ''}`

	match = s.match(/^gpt-([\d.]+)(?:-(.+))?$/)
	if (match)
		return `GPT-${match[1]}${match[2] ? ` ${match[2].split('-').map(titleCase).join(' ')}` : ''}`

	match = s.match(/^glm-([\d.]+)/)
	if (match)
		return `GLM-${match[1]}`

	match = s.match(/^deepseek-(.+)$/)
	if (match)
		return `DeepSeek ${match[1]!.split('-').map(w => (w.startsWith('v') ? w.toUpperCase() : titleCase(w))).join(' ')}`

	match = s.match(/^kimi-(.+)$/)
	if (match)
		return `Kimi ${match[1]!.split('-').map(w => (w.startsWith('k') ? w.toUpperCase() : titleCase(w))).join(' ')}`

	match = s.match(/^mimo-(.+)$/)
	if (match)
		return `MiMo ${match[1]!.split('-').map(w => (w.startsWith('v') ? w.toUpperCase() : titleCase(w))).join(' ')}`

	if (s === 'auto' || s === 'default')
		return 'Auto'

	return s.split('-').map(titleCase).join(' ')
}

function modelFamily(displayName: string): string {
	if (displayName.startsWith('GPT'))
		return 'GPT'
	if (/^(?:Opus|Sonnet|Haiku|Fable)/.test(displayName))
		return 'Claude'
	if (displayName.startsWith('Grok'))
		return 'Grok'
	if (displayName.startsWith('Gemini'))
		return 'Gemini'
	return OTHER_KEY
}

function topSlices(
	buckets: Map<string, { c: number, t: number }>,
	totalTokens: number,
	minShare: number,
	maxItems = 3,
): ModelSlice[] {
	if (totalTokens <= 0)
		return []

	const rows = [...buckets.entries()]
		.map(([n, v]) => ({ c: v.c, n, t: v.t }))
		.sort((a, b) => b.t - a.t)

	const kept = rows
		.filter(row => row.n !== OTHER_KEY && row.t / totalTokens >= minShare)
		.slice(0, maxItems)

	const keptSet = new Set(kept)
	const rest = rows.filter(row => !keptSet.has(row))

	const slices: ModelSlice[] = kept.map(row => ({
		c: Number(row.c.toFixed(2)),
		n: row.n,
		p: Number(((row.t / totalTokens) * 100).toFixed(1)),
		t: row.t,
	}))

	const restTokens = rest.reduce((sum, row) => sum + row.t, 0)
	const restCost = rest.reduce((sum, row) => sum + row.c, 0)
	if (restTokens > 0) {
		slices.push({
			c: Number(restCost.toFixed(2)),
			n: '',
			other: true,
			p: Number(((restTokens / totalTokens) * 100).toFixed(1)),
			t: restTokens,
		})
	}

	return slices
}

function resolveEndDate(raw: RawTokensCiResponse): Date | null {
	const candidates: string[] = []
	if (raw.chartRange?.end && /^\d{4}-\d{2}-\d{2}$/.test(raw.chartRange.end))
		candidates.push(raw.chartRange.end)
	for (const entry of raw.contributions ?? []) {
		if (entry.date && /^\d{4}-\d{2}-\d{2}$/.test(entry.date))
			candidates.push(entry.date)
	}
	if (candidates.length === 0)
		return null

	candidates.sort()
	const latest = candidates.at(-1)!
	const parsed = new Date(`${latest}T00:00:00Z`)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function buildCodingPulseData(raw: RawTokensCiResponse): CodingPulseData | null {
	const contributions = raw.contributions
	if (!Array.isArray(contributions) || contributions.length === 0 || !raw.stats)
		return null

	const endDate = resolveEndDate(raw)
	if (!endDate)
		return null

	const byDate = new Map<string, RawContribution>()
	const allFamilies = new Map<string, { c: number, t: number }>()
	const allClients = new Map<string, number>()
	let totalMessages = 0
	let totalModelTokens = 0

	for (const entry of contributions) {
		if (entry.date)
			byDate.set(entry.date, entry)

		for (const client of entry.clients ?? []) {
			const clientName = client.client?.trim()
			for (const [rawModel, usage] of Object.entries(client.models ?? {})) {
				const tokens = usage.tokens ?? 0
				const cost = usage.cost ?? 0
				const messages = usage.messages ?? 0
				if (tokens <= 0 && cost <= 0 && messages <= 0)
					continue

				const fam = modelFamily(normalizeModelName(rawModel))
				const prev = allFamilies.get(fam) ?? { c: 0, t: 0 }
				prev.t += tokens
				prev.c += cost
				allFamilies.set(fam, prev)

				if (clientName)
					allClients.set(clientName, (allClients.get(clientName) ?? 0) + tokens)

				totalMessages += messages
				totalModelTokens += tokens
			}
		}
	}

	const rawDays: Array<Omit<PulseDay, 'h' | 'tier'>> = []
	for (let offset = PULSE_DAY_COUNT - 1; offset >= 0; offset--) {
		const date = new Date(endDate.getTime() - offset * 86_400_000)
		const iso = date.toISOString().slice(0, 10)
		const entry = byDate.get(iso)
		const dayModels = new Map<string, { c: number, t: number }>()
		const dayClients = new Map<string, number>()
		let dayMessages = 0
		let dayModelTokens = 0

		for (const client of entry?.clients ?? []) {
			const clientName = client.client?.trim()
			for (const [rawModel, usage] of Object.entries(client.models ?? {})) {
				const tokens = usage.tokens ?? 0
				const cost = usage.cost ?? 0
				const messages = usage.messages ?? 0
				if (tokens <= 0 && cost <= 0 && messages <= 0)
					continue

				const name = normalizeModelName(rawModel)
				const prev = dayModels.get(name) ?? { c: 0, t: 0 }
				prev.t += tokens
				prev.c += cost
				dayModels.set(name, prev)

				if (clientName)
					dayClients.set(clientName, (dayClients.get(clientName) ?? 0) + tokens)

				dayMessages += messages
				dayModelTokens += tokens
			}
		}

		const tokens = entry?.totals?.tokens ?? dayModelTokens
		const cost = entry?.totals?.cost ?? 0
		rawDays.push({
			c: Number(cost.toFixed(2)),
			cl: [...dayClients.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name),
			d: iso,
			m: dayMessages || (entry?.totals?.messages ?? 0),
			md: tokens > 0 ? topSlices(dayModels, dayModelTokens || tokens, 0.02) : [],
			t: tokens,
			w: date.getUTCDay(),
		})
	}

	const nonZero = rawDays.map(day => day.t).filter(t => t > 0).sort((a, b) => a - b)
	const quantile = (p: number) =>
		nonZero.length > 0 ? nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * p))]! : 0
	const p30 = quantile(0.3)
	const p65 = quantile(0.65)
	const p90 = quantile(0.9)
	const maxTokens = nonZero.at(-1) ?? 1
	const logMax = Math.log10(maxTokens + 1)
	const logMin = Math.log10(1e5)
	const logSpan = Math.max(logMax - logMin, 0.001)

	let peakIdx = -1
	let peakTokens = 0
	const days: PulseDay[] = rawDays.map((day, idx) => {
		if (day.t > peakTokens) {
			peakTokens = day.t
			peakIdx = idx
		}

		const tier: PulseTier = !day.t
			? 0
			: day.t >= p90
				? 4
				: day.t >= p65
					? 3
					: day.t >= p30
						? 2
						: 1

		let h = 3
		if (day.t > 0) {
			const norm = Math.max(0, (Math.log10(day.t + 1) - logMin) / logSpan)
			h = Math.round(12 + (norm * 0.62 + (day.t / maxTokens) * 0.38) * 84)
		}

		return { ...day, h, tier }
	})

	const totalTokens = raw.stats.totalTokens ?? totalModelTokens
	return {
		all: {
			activeDays: raw.stats.activeDays ?? nonZero.length,
			c: Number((raw.stats.totalCost ?? 0).toFixed(2)),
			cl: [...allClients.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name),
			m: totalMessages,
			md: topSlices(allFamilies, totalModelTokens || totalTokens, 0.03),
			t: totalTokens,
		},
		days,
		p90,
		peakIdx,
		restDays: days.length - nonZero.length,
	}
}

function defaultCache(): Cache | null {
	if (import.meta.env.DEV)
		return null

	return (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default ?? null
}

async function readWorkerCache(): Promise<CodingPulseData | null> {
	try {
		const cached = await defaultCache()?.match(CACHE_KEY_URL)
		if (!cached?.ok)
			return null
		return await cached.json() as CodingPulseData
	}
	catch {
		return null
	}
}

async function writeWorkerCache(data: CodingPulseData): Promise<void> {
	try {
		const cache = defaultCache()
		if (!cache)
			return
		await cache.put(
			CACHE_KEY_URL,
			new Response(JSON.stringify(data), {
				headers: {
					'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
					'Content-Type': 'application/json; charset=utf-8',
				},
			}),
		)
	}
	catch {
		// Cache writes are best-effort.
	}
}

async function fetchFresh(timeoutMs: number): Promise<CodingPulseData | null> {
	if (inflightFetch)
		return inflightFetch

	const task = (async () => {
		try {
			const response = await fetch(TOKENS_CI_API_URL, {
				headers: { Accept: 'application/json' },
				signal: AbortSignal.timeout(timeoutMs),
			})
			if (!response.ok)
				return null

			const raw = await response.json() as RawTokensCiResponse
			const parsed = buildCodingPulseData(raw)
			if (!parsed)
				return null

			isolateCache = { at: Date.now(), data: parsed }
			await writeWorkerCache(parsed)
			return parsed
		}
		catch {
			return null
		}
		finally {
			inflightFetch = null
		}
	})()

	inflightFetch = task
	return task
}

export async function fetchCodingPulse(
	waitUntil?: (promise: Promise<unknown>) => void,
): Promise<CodingPulseData | null> {
	const now = Date.now()
	if (isolateCache && now - isolateCache.at < CACHE_TTL_MS)
		return isolateCache.data

	const cached = await readWorkerCache()
	if (cached) {
		isolateCache = { at: now, data: cached }
		return cached
	}

	if (isolateCache) {
		// Serve stale isolate data immediately while refreshing in the background.
		const refresh = fetchFresh(REFRESH_TIMEOUT_MS)
		if (waitUntil) {
			waitUntil(refresh)
			return isolateCache.data
		}
		return (await refresh) ?? isolateCache.data
	}

	return await fetchFresh(COLD_TIMEOUT_MS)
}
