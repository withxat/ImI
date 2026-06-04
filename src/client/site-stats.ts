import 'number-flow'
import 'number-flow/group'

const POLL_MS = 45_000
const NUMBER_FORMAT: Intl.NumberFormatOptions = {
	maximumFractionDigits: 0,
	useGrouping: true,
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

function numberFlows(root: Element) {
	return [...root.querySelectorAll<NumberFlowElement>('number-flow[data-site-stats-flow]')]
}

function applyStats(root: Element, stats: SiteStatsPayload) {
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

async function sendPresence() {
	await fetch('/api/presence.json', {
		cache: 'no-store',
		credentials: 'same-origin',
		method: 'POST',
	})
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

export function initSiteStats() {
	const footer = document.querySelector<HTMLElement>('[data-site-stats]')
	if (!footer)
		return () => {}

	upgradeDigits(footer)

	let pollTimer = 0

	const refresh = async () => {
		await sendPresence()
		const stats = await fetchStats()
		if (stats)
			applyStats(footer, stats)
	}

	void refresh()
	pollTimer = window.setInterval(() => void refresh(), POLL_MS)

	return () => {
		window.clearInterval(pollTimer)
	}
}

let disposeSiteStats: (() => void) | undefined

export function disposeSiteStatsModule() {
	disposeSiteStats?.()
	disposeSiteStats = undefined
}

export function runSiteStatsModule() {
	disposeSiteStatsModule()
	disposeSiteStats = initSiteStats()
}
