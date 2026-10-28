/// <reference path="../worker-configuration.d.ts" />

import type { MiddlewareHandler } from 'astro'

import { env } from 'cloudflare:workers'

import {
	edgeCacheKey,
	isEdgeCacheableRequest,
	matchEdgeCache,
	putEdgeCache,
} from '@/lib/edge-cache'
import { LOCALE_COOKIE_NAME } from '@/lib/i18n/constants'
import {
	LOCALE_SWITCH_PARAM,
	parseLocaleSwitchParam,
} from '@/lib/i18n/locale-switch'
import { resolveLocaleFromHeaders } from '@/lib/i18n/request-locale'
import { localeCookieOptions } from '@/lib/i18n/set-locale-cookie'
import { heartbeatSitePresence, recordSiteView } from '@/lib/site-stats/server.ts'
import {
	getOrCreateVisitorSessionId,
	hasRecordedVisitorView,
	markVisitorViewRecorded,
	shouldTrackSiteVisit,
} from '@/lib/site-stats/tracking.ts'
import { readVisitorGeoFromRequest } from '@/lib/visitor-geo'

function trimTrailingSlash(pathname: string) {
	if (pathname === '/')
		return pathname
	if (!pathname.endsWith('/'))
		return pathname
	return pathname.slice(0, -1)
}

export const onRequest: MiddlewareHandler = async (context, next) => {
	const { request, url } = context

	// 1) Persist locale from ?set_locale= (cookie only — no /en /zh URL prefixes).
	const switchTarget = parseLocaleSwitchParam(url.searchParams.get(LOCALE_SWITCH_PARAM))
	if (switchTarget) {
		const nextUrl = new URL(request.url)
		nextUrl.searchParams.delete(LOCALE_SWITCH_PARAM)
		const redirectTo = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
		context.cookies.set(LOCALE_COOKIE_NAME, switchTarget, localeCookieOptions())
		return context.redirect(redirectTo, 303)
	}

	// 2) Normalize trailing slash (keep behavior consistent with prior drop-trailing-slash).
	const trimmed = trimTrailingSlash(url.pathname)
	if (!context.isPrerendered && trimmed !== url.pathname) {
		const nextUrl = new URL(request.url)
		nextUrl.pathname = trimmed
		return Response.redirect(nextUrl.toString(), 308)
	}

	// 3) Request-scoped locale (cookie first, then Accept-Language).
	context.locals.locale = resolveLocaleFromHeaders(
		request.headers.get('cookie') ?? undefined,
		request.headers.get('accept-language') ?? undefined,
	)

	// 4) Visitor geo (Cloudflare headers/cf).
	context.locals.visitorGeo = readVisitorGeoFromRequest(request)

	// 5) Edge HTML cache. Hits still fall through to stats tracking and cookies below.
	const waitUntil = context.locals.cfContext?.waitUntil.bind(context.locals.cfContext)
	const cacheKey = !context.isPrerendered && isEdgeCacheableRequest(request, url)
		? edgeCacheKey({
				countryCode: context.locals.visitorGeo.countryCode,
				locale: context.locals.locale,
				pathname: url.pathname,
			})
		: null

	const cached = cacheKey ? await matchEdgeCache(cacheKey).catch(() => null) : null
	const response = cached ?? (cacheKey ? putEdgeCache(cacheKey, await next(), waitUntil) : await next())

	if (shouldTrackSiteVisit(request, url.pathname)) {
		const sessionId = getOrCreateVisitorSessionId(context.cookies)
		const tasks: Promise<unknown>[] = [heartbeatSitePresence(env, sessionId)]

		if (!hasRecordedVisitorView(context.cookies)) {
			markVisitorViewRecorded(context.cookies)
			tasks.push(recordSiteView(env, sessionId))
		}

		waitUntil?.(Promise.all(tasks).catch(() => undefined))
	}

	return response
}
