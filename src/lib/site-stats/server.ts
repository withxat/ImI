/// <reference path="../../../worker-configuration.d.ts" />

import type { SiteStatsSnapshot } from '@/worker/site-stats.ts'

import { SITE_STATS_DO_NAME } from '@/lib/site-stats/constants.ts'
import { SITE_STATS_INITIAL_TOTAL } from '@/worker/site-stats.ts'

function hasSiteStatsBinding(
	env: Env,
): env is Env & { SITE_STATS: DurableObjectNamespace } {
	return 'SITE_STATS' in env && env.SITE_STATS != null
}

export function siteStatsStub(env: Env) {
	if (!hasSiteStatsBinding(env))
		return null

	const id = env.SITE_STATS.idFromName(SITE_STATS_DO_NAME)
	return env.SITE_STATS.get(id)
}

async function siteStatsRequest(
	env: Env,
	pathname: '/heartbeat' | '/stats' | '/view',
	init?: RequestInit,
): Promise<null | Response> {
	const stub = siteStatsStub(env)
	if (!stub)
		return null

	return stub.fetch(`https://site-stats.internal${pathname}`, init)
}

const FALLBACK_STATS: SiteStatsSnapshot = {
	onlineNow: 0,
	totalViews: SITE_STATS_INITIAL_TOTAL,
}

const ISOLATE_CACHE_TTL_MS = 60_000
let cachedSnapshot: null | { at: number, stats: SiteStatsSnapshot } = null

function updateIsolateCache(stats: SiteStatsSnapshot) {
	cachedSnapshot = { at: Date.now(), stats }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs?: number): Promise<null | T> {
	if (!timeoutMs)
		return promise

	let timer: ReturnType<typeof setTimeout> | undefined
	try {
		return await Promise.race([
			promise,
			new Promise<null>((resolve) => {
				timer = setTimeout(resolve, timeoutMs, null)
			}),
		])
	}
	finally {
		if (timer !== undefined)
			clearTimeout(timer)
	}
}

export async function fetchSiteStats(
	env: Env,
	options?: { timeoutMs?: number, useIsolateCache?: boolean },
): Promise<SiteStatsSnapshot> {
	if (options?.useIsolateCache && cachedSnapshot && Date.now() - cachedSnapshot.at < ISOLATE_CACHE_TTL_MS) {
		return cachedSnapshot.stats
	}

	try {
		const response = await withTimeout(siteStatsRequest(env, '/stats'), options?.timeoutMs)
		if (!response?.ok)
			return options?.useIsolateCache && cachedSnapshot ? cachedSnapshot.stats : FALLBACK_STATS

		const stats = await response.json() as SiteStatsSnapshot
		updateIsolateCache(stats)
		return stats
	}
	catch {
		return options?.useIsolateCache && cachedSnapshot ? cachedSnapshot.stats : FALLBACK_STATS
	}
}

export async function recordSiteView(env: Env, sessionId: string) {
	try {
		await siteStatsRequest(env, '/view', {
			body: JSON.stringify({ sessionId }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		})
	}
	catch {
		// Stats are best-effort; never block page rendering.
	}
}

export async function heartbeatSitePresence(env: Env, sessionId: string): Promise<null | SiteStatsSnapshot> {
	try {
		const response = await siteStatsRequest(env, '/heartbeat', {
			body: JSON.stringify({ sessionId }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		})
		if (!response?.ok)
			return null

		const stats = await response.json() as SiteStatsSnapshot
		updateIsolateCache(stats)
		return stats
	}
	catch {
		// Stats are best-effort; never block page rendering.
		return null
	}
}
