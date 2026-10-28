import type { AstroCookies } from 'astro'

import {
	VISITOR_SESSION_COOKIE,
	VISITOR_VIEWED_COOKIE,
} from '@/lib/site-stats/constants.ts'

const ONE_DAY_SECONDS = 60 * 60 * 24
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

const TRACKED_PATH_PREFIXES = ['/', '/post', '/design'] as const

// Crawlers, link unfurlers, monitors and headless/CLI clients. Bots rarely keep
// cookies, so each request would otherwise mint a fresh session and count as a view.
const BOT_USER_AGENT_PATTERN = /bot|crawl|spider|slurp|scrape|fetch|preview|monitor|uptime|lighthouse|pagespeed|headless|phantom|puppeteer|playwright|selenium|curl|wget|httpie|python|java\/|go-http|okhttp|axios|node-fetch|undici|feed|rss|facebookexternalhit|embedly|whatsapp|vercel|cloudflare/i

interface Cf { botManagement?: { verifiedBot?: boolean } }

export function isLikelyBot(request: Request) {
	// Only populated on Bot Management plans; the UA check covers everything else.
	if ((request as Request & { cf?: Cf }).cf?.botManagement?.verifiedBot)
		return true

	const userAgent = request.headers.get('user-agent')
	if (!userAgent)
		return true

	return BOT_USER_AGENT_PATTERN.test(userAgent)
}

export function shouldTrackSiteVisit(request: Request, pathname: string) {
	if (request.method !== 'GET')
		return false

	if (isLikelyBot(request))
		return false

	if (pathname.startsWith('/api/'))
		return false

	if (pathname.endsWith('.xml'))
		return false

	if (!TRACKED_PATH_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)))
		return false

	const accept = request.headers.get('accept') ?? ''
	if (!accept.includes('text/html') && !accept.includes('*/*'))
		return false

	if (request.headers.get('sec-purpose') === 'prefetch' || request.headers.get('purpose') === 'prefetch')
		return false

	return true
}

export function getOrCreateVisitorSessionId(cookies: AstroCookies) {
	const existing = cookies.get(VISITOR_SESSION_COOKIE)?.value
	if (existing)
		return existing

	const sessionId = crypto.randomUUID()
	cookies.set(VISITOR_SESSION_COOKIE, sessionId, {
		httpOnly: true,
		maxAge: ONE_YEAR_SECONDS,
		path: '/',
		sameSite: 'lax',
	})

	return sessionId
}

export function markVisitorViewRecorded(cookies: AstroCookies) {
	cookies.set(VISITOR_VIEWED_COOKIE, '1', {
		httpOnly: true,
		maxAge: ONE_DAY_SECONDS,
		path: '/',
		sameSite: 'lax',
	})
}

export function hasRecordedVisitorView(cookies: AstroCookies) {
	return cookies.get(VISITOR_VIEWED_COOKIE)?.value === '1'
}
