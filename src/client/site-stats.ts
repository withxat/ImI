import 'number-flow'
import 'number-flow/group'

const POLL_MS = 45_000
const NUMBER_FORMAT: Intl.NumberFormatOptions = {
	maximumFractionDigits: 0,
	useGrouping: false,
}

interface SiteStatsPayload {
	onlineNow: number
	totalViews: number
}

type NumberFlowElement = HTMLElement & {
	format?: Intl.NumberFormatOptions
	locales?: string
	update: (value: number) => void
}

let activeRoot: HTMLElement | null = null
let lastStats: null | SiteStatsPayload = null
let lastFetchedAt = 0
let pollTimer: number | undefined
let inFlight = false
let visibilityController: AbortController | null = null

function numberFlows(root: Element) {
	return [...root.querySelectorAll<NumberFlowElement>('number-flow[data-site-stats-flow]')]
}

function applyStats(root: HTMLElement, stats: SiteStatsPayload) {
	// The reader is always online, so 0 or 1 means it is just them. Only fresh stats
	// set this: the server render is edge-cached and cannot know who is reading now.
	root.dataset.siteStatsAlone = String(stats.onlineNow <= 1)
	for (const flow of numberFlows(root)) {
		const key = flow.dataset.siteStatsFlow
		const value = key === 'online' ? stats.onlineNow : stats.totalViews
		flow.update(value)
	}
}

async function fetchStats() {
	const response = await fetch('/api/stats.json', {
		cache: 'no-store',
		credentials: 'same-origin',
	})
	if (!response.ok)
		return null

	return response.json() as Promise<SiteStatsPayload>
}

async function sendPresence(): Promise<null | SiteStatsPayload> {
	const response = await fetch('/api/presence.json', {
		cache: 'no-store',
		credentials: 'same-origin',
		method: 'POST',
	})
	if (response.status !== 200)
		return null

	return response.json() as Promise<SiteStatsPayload>
}

function upgradeDigits(root: HTMLElement) {
	const locale = root.dataset.siteStatsLocale ?? document.documentElement.lang ?? 'en'

	for (const flow of numberFlows(root)) {
		flow.locales = locale
		flow.format = NUMBER_FORMAT
	}

	for (const span of root.querySelectorAll<HTMLElement>('[data-site-stats-digit]')) {
		const flow = document.createElement('number-flow') as NumberFlowElement
		flow.className = span.className
		flow.dataset.siteStatsFlow = span.dataset.siteStatsFlow ?? ''
		flow.dataset.siteStatsValue = span.dataset.siteStatsValue ?? ''
		flow.locales = locale
		flow.format = NUMBER_FORMAT

		const initial = Number(span.dataset.siteStatsValue)
		span.replaceWith(flow)
		if (Number.isFinite(initial))
			flow.update(initial)
	}

	if (root.parentElement?.tagName.toLowerCase() === 'number-flow-group')
		return

	const group = document.createElement('number-flow-group')
	const parent = root.parentElement
	if (!parent)
		return

	parent.insertBefore(group, root)
	group.appendChild(root)
}

async function refresh() {
	if (inFlight || document.hidden || !activeRoot?.isConnected)
		return
	inFlight = true
	try {
		const stats = (await sendPresence()) ?? (await fetchStats())
		if (stats) {
			lastStats = stats
			lastFetchedAt = Date.now()
			if (activeRoot?.isConnected)
				applyStats(activeRoot, stats)
		}
	}
	catch {}
	finally {
		inFlight = false
	}
}

function stopPolling() {
	if (pollTimer !== undefined) {
		window.clearInterval(pollTimer)
		pollTimer = undefined
	}
}

function startPolling(forceRefresh = false) {
	stopPolling()
	const stale = lastFetchedAt === 0 || Date.now() - lastFetchedAt >= POLL_MS
	if (forceRefresh || stale)
		void refresh()
	pollTimer = window.setInterval(() => void refresh(), POLL_MS)
}

export function disposeSiteStatsModule() {
	stopPolling()
	visibilityController?.abort()
	visibilityController = null
	activeRoot = null
}

/**
 * Reconciles the footer stats widget across Astro view transitions. Because the footer
 * is `transition:persist` per locale, same-locale navigation keeps the same root node
 * and reuses the running poll timer without firing a redundant heartbeat on every click.
 */
export function runSiteStatsModule() {
	const footer = document.querySelector<HTMLElement>('[data-site-stats]')
	if (!footer) {
		disposeSiteStatsModule()
		return
	}

	if (footer === activeRoot && pollTimer !== undefined)
		return

	activeRoot = footer
	upgradeDigits(footer)

	if (lastStats)
		applyStats(footer, lastStats)

	if (!visibilityController) {
		visibilityController = new AbortController()
		document.addEventListener('visibilitychange', () => {
			if (document.hidden)
				stopPolling()
			else if (activeRoot?.isConnected)
				startPolling(true)
		}, { signal: visibilityController.signal })
	}

	if (!document.hidden)
		startPolling()
}
