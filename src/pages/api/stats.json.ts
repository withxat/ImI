/// <reference path="../../../worker-configuration.d.ts" />

import type { APIRoute } from 'astro'

import { env } from 'cloudflare:workers'

import { fetchSiteStats } from '@/lib/site-stats/server.ts'

export const prerender = false

export const GET: APIRoute = async () => {
	const stats = await fetchSiteStats(env)

	return new Response(JSON.stringify(stats), {
		headers: {
			'Cache-Control': 'no-store',
			'Content-Type': 'application/json',
		},
	})
}
