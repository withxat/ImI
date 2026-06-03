/// <reference path="../../../worker-configuration.d.ts" />

import type { APIRoute } from 'astro'

import { env } from 'cloudflare:workers'

import { VISITOR_SESSION_COOKIE } from '@/lib/site-stats/constants.ts'
import { heartbeatSitePresence } from '@/lib/site-stats/server.ts'

export const prerender = false

export const POST: APIRoute = async ({ cookies }) => {
	const sessionId = cookies.get(VISITOR_SESSION_COOKIE)?.value?.trim()
	if (!sessionId)
		return new Response('session required', { status: 401 })

	await heartbeatSitePresence(env, sessionId)

	return new Response(null, {
		headers: { 'Cache-Control': 'no-store' },
		status: 204,
	})
}
