import type { MiddlewareHandler } from 'astro'

import { resolveLocaleFromHeaders } from '@/lib/i18n/request-locale'
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

	// 1) Normalize trailing slash (keep behavior consistent with prior drop-trailing-slash).
	const trimmed = trimTrailingSlash(url.pathname)
	if (trimmed !== url.pathname) {
		const nextUrl = new URL(request.url)
		nextUrl.pathname = trimmed
		return Response.redirect(nextUrl.toString(), 308)
	}

	// 2) Request-scoped locale (cookie first, then Accept-Language).
	context.locals.locale = resolveLocaleFromHeaders(
		request.headers.get('cookie') ?? undefined,
		request.headers.get('accept-language') ?? undefined,
	)

	// 3) Visitor geo (Cloudflare headers/cf).
	context.locals.visitorGeo = readVisitorGeoFromRequest(request)

	return next()
}
