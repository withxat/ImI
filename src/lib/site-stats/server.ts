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
	options?: { timeoutMs?: number },
): Promise<SiteStatsSnapshot> {
	try {
		const response = await withTimeout(siteStatsRequest(env, '/stats'), options?.timeoutMs)
		if (!response?.ok)
			return FALLBACK_STATS

		return await response.json() as SiteStatsSnapshot
	}
	catch {
		return FALLBACK_STATS
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

		return await response.json() as SiteStatsSnapshot
	}
	catch {
		// Stats are best-effort; never block page rendering.
		return null
	}
}
