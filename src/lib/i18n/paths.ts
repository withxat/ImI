import type { LinkProps } from 'waku/router/client'

import type { Locale } from '@/lib/i18n/constants'

import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/constants'

export type AppRouteHref = LinkProps['to']

/** Internal path without locale prefix, always starts with `/` (e.g. `/`, `/post`, `/post/foo`). */
export type LocalePath = `/${string}`

export function withLocale(locale: Locale, path: LocalePath): AppRouteHref {
	const normalized = path === '/' ? '' : path
	return `/${locale}${normalized}` as AppRouteHref
}

export function stripLocalePrefix(pathname: string): { locale: Locale | null, rest: LocalePath } {
	const segments = pathname.split('/').filter(Boolean)
	const first = segments[0]
	if (first && isLocale(first)) {
		const rest = segments.slice(1).join('/')
		return { locale: first, rest: (rest ? `/${rest}` : '/') as LocalePath }
	}
	return { locale: null, rest: (pathname.startsWith('/') ? pathname : `/${pathname}`) as LocalePath }
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): AppRouteHref {
	const { rest } = stripLocalePrefix(pathname)
	return withLocale(nextLocale, rest)
}

export function defaultLocalePath(path: LocalePath): AppRouteHref {
	return withLocale(DEFAULT_LOCALE, path)
}
