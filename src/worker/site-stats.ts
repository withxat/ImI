/// <reference path="../../worker-configuration.d.ts" />

import { DurableObject } from 'cloudflare:workers'

export const SITE_STATS_INITIAL_TOTAL = 914
const ONLINE_TTL_MS = 90_000
const VIEW_DEDUP_MS = 60 * 60 * 24 * 1000
const PRUNE_ALARM_MS = 60_000

export interface SiteStatsSnapshot {
	onlineNow: number
	totalViews: number
}

interface SeenSessions {
	[sessionId: string]: number
}

export class SiteStats extends DurableObject {
	#active = new Map<string, number>()

	override async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === 'GET' && url.pathname === '/stats') {
			return Response.json(await this.#getStats())
		}

		if (request.method === 'POST') {
			const body = await request.json() as { sessionId?: string }
			const sessionId = body.sessionId?.trim()
			if (!sessionId)
				return new Response('sessionId required', { status: 400 })

			if (url.pathname === '/view') {
				await this.#recordView(sessionId)
				return new Response(null, { status: 204 })
			}

			if (url.pathname === '/heartbeat') {
				this.#heartbeat(sessionId)
				return new Response(null, { status: 204 })
			}
		}

		return new Response('Not found', { status: 404 })
	}

	override async alarm(): Promise<void> {
		this.#pruneActive()
		await this.#scheduleAlarm()
	}

	async #ensureInitialized() {
		const total = await this.ctx.storage.get<number>('totalViews')
		if (total === undefined)
			await this.ctx.storage.put('totalViews', SITE_STATS_INITIAL_TOTAL)

		const seen = await this.ctx.storage.get<SeenSessions>('seenSessions')
		if (!seen)
			await this.ctx.storage.put('seenSessions', {})

		await this.#scheduleAlarm()
	}

	async #scheduleAlarm() {
		const current = await this.ctx.storage.getAlarm()
		if (current === null)
			await this.ctx.storage.setAlarm(Date.now() + PRUNE_ALARM_MS)
	}

	#pruneActive(now = Date.now()) {
		for (const [sessionId, lastSeen] of this.#active) {
			if (now - lastSeen > ONLINE_TTL_MS)
				this.#active.delete(sessionId)
		}
	}

	#heartbeat(sessionId: string) {
		this.#active.set(sessionId, Date.now())
	}

	async #recordView(sessionId: string) {
		await this.#ensureInitialized()
		this.#heartbeat(sessionId)

		const now = Date.now()
		const seen = await this.ctx.storage.get<SeenSessions>('seenSessions') ?? {}
		const lastSeen = seen[sessionId]
		if (lastSeen && now - lastSeen < VIEW_DEDUP_MS)
			return

		seen[sessionId] = now
		const pruned = this.#pruneSeenSessions(seen, now)
		await this.ctx.storage.put('seenSessions', pruned)

		const total = await this.ctx.storage.get<number>('totalViews') ?? SITE_STATS_INITIAL_TOTAL
		await this.ctx.storage.put('totalViews', total + 1)
	}

	#pruneSeenSessions(seen: SeenSessions, now: number): SeenSessions {
		const next: SeenSessions = {}
		for (const [sessionId, timestamp] of Object.entries(seen)) {
			if (now - timestamp < VIEW_DEDUP_MS)
				next[sessionId] = timestamp
		}
		return next
	}

	async #getStats(): Promise<SiteStatsSnapshot> {
		await this.#ensureInitialized()
		this.#pruneActive()

		const totalViews = await this.ctx.storage.get<number>('totalViews') ?? SITE_STATS_INITIAL_TOTAL
		return {
			onlineNow: this.#active.size,
			totalViews,
		}
	}
}
