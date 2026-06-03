import 'number-flow'
import 'number-flow/group'

const POLL_MS = 45_000

interface SiteStatsPayload {
	onlineNow: number
	totalViews: number
}

function numberFlows(root: Element) {
	return [...root.querySelectorAll<HTMLElement>('[data-site-stats-flow]')]
}

function applyStats(root: Element, stats: SiteStatsPayload) {
	for (const el of numberFlows(root)) {
		const key = el.dataset.siteStatsFlow
		const value = key === 'online' ? stats.onlineNow : stats.totalViews
		const flow = el as HTMLElement & { update?: (next: number) => void }
		if (typeof flow.update === 'function')
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

function hydrateFlows(root: Element) {
	for (const el of numberFlows(root)) {
		const flow = el as HTMLElement & { update?: (next: number) => void }
		const initial = Number(el.dataset.siteStatsValue)
		if (typeof flow.update === 'function' && Number.isFinite(initial))
			flow.update(initial)
	}
}

export function initSiteStats() {
	const footer = document.querySelector<HTMLElement>('[data-site-stats]')
	if (!footer)
		return () => {}

	hydrateFlows(footer)

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
