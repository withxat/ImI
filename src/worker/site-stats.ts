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

export class SiteStats extends DurableObject {
	#active = new Map<string, number>()

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env)

		ctx.blockConcurrencyWhile(async () => {
			ctx.storage.sql.exec(`
				CREATE TABLE IF NOT EXISTS seen_sessions (
					session_id TEXT PRIMARY KEY,
					last_seen INTEGER NOT NULL
				);
				CREATE INDEX IF NOT EXISTS seen_sessions_last_seen ON seen_sessions (last_seen);
			`)

			if (await ctx.storage.get<number>('totalViews') === undefined)
				await ctx.storage.put('totalViews', SITE_STATS_INITIAL_TOTAL)

			// Legacy: dedup map used to live in a single KV value.
			await ctx.storage.delete('seenSessions')
		})
	}

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
				await this.#heartbeat(sessionId)
				return new Response(null, { status: 204 })
			}
		}

		return new Response('Not found', { status: 404 })
	}

	override async alarm(): Promise<void> {
		this.#pruneActive()

		// Stop waking up once nobody is online; the next heartbeat re-arms it.
		if (this.#active.size > 0)
			await this.ctx.storage.setAlarm(Date.now() + PRUNE_ALARM_MS)
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

	async #heartbeat(sessionId: string) {
		this.#active.set(sessionId, Date.now())
		await this.#scheduleAlarm()
	}

	async #recordView(sessionId: string) {
		await this.#heartbeat(sessionId)

		const now = Date.now()
		const sql = this.ctx.storage.sql
		sql.exec('DELETE FROM seen_sessions WHERE last_seen <= ?', now - VIEW_DEDUP_MS)

		const inserted = sql.exec(
			'INSERT INTO seen_sessions (session_id, last_seen) VALUES (?, ?) ON CONFLICT (session_id) DO NOTHING',
			sessionId,
			now,
		).rowsWritten
		if (inserted === 0)
			return

		const total = await this.ctx.storage.get<number>('totalViews') ?? SITE_STATS_INITIAL_TOTAL
		await this.ctx.storage.put('totalViews', total + 1)
	}

	async #getStats(): Promise<SiteStatsSnapshot> {
		this.#pruneActive()

		const totalViews = await this.ctx.storage.get<number>('totalViews') ?? SITE_STATS_INITIAL_TOTAL
		return {
			onlineNow: this.#active.size,
			totalViews,
		}
	}
}
