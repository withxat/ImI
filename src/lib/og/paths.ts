import type { Locale } from '@/lib/i18n/constants'
import type { OgStaticPage } from '@/lib/og/pages'

import { DEFAULT_LOCALE } from '@/lib/i18n/constants'
import { OG_STATIC_PAGE_FILES } from '@/lib/og/pages'
import { absoluteUrl } from '@/lib/seo-data'

export function defaultOgImagePath(locale: Locale = DEFAULT_LOCALE) {
	return `/og/${locale}/default.png`
}

export function postOgImagePath(slug: string, locale: Locale = DEFAULT_LOCALE) {
	return `/og/${locale}/post/${slug}.png`
}

export function pageOgImagePath(page: OgStaticPage, locale: Locale = DEFAULT_LOCALE) {
	return `/og/${locale}/pages/${OG_STATIC_PAGE_FILES[page]}.png`
}

export function defaultOgImageUrl(locale: Locale = DEFAULT_LOCALE) {
	return absoluteUrl(defaultOgImagePath(locale))
}

export function postOgImageUrl(slug: string, locale: Locale = DEFAULT_LOCALE) {
	return absoluteUrl(postOgImagePath(slug, locale))
}

export function pageOgImageUrl(page: OgStaticPage, locale: Locale = DEFAULT_LOCALE) {
	return absoluteUrl(pageOgImagePath(page, locale))
}
