import type { MiddlewareHandler } from 'astro'

import { LOCALE_COOKIE_NAME } from '@/lib/i18n/constants'
import {
	LOCALE_SWITCH_PARAM,
	parseLocaleSwitchParam,
} from '@/lib/i18n/locale-switch'
import { resolveLocaleFromHeaders } from '@/lib/i18n/request-locale'
import { localeCookieOptions } from '@/lib/i18n/set-locale-cookie'
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
	if (trimmed !== url.pathname) {
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

	return next()
}
