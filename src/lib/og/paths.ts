import type { OgStaticPage } from '@/lib/og/pages'

import { OG_STATIC_PAGE_FILES } from '@/lib/og/pages'
import { absoluteUrl } from '@/lib/seo-data'

export const DEFAULT_OG_IMAGE_PATH = '/og/default.png'

export function postOgImagePath(slug: string) {
	return `/og/post/${slug}.png`
}

export function pageOgImagePath(page: OgStaticPage) {
	return `/og/pages/${OG_STATIC_PAGE_FILES[page]}.png`
}

export function defaultOgImageUrl() {
	return absoluteUrl(DEFAULT_OG_IMAGE_PATH)
}

export function postOgImageUrl(slug: string) {
	return absoluteUrl(postOgImagePath(slug))
}

export function pageOgImageUrl(page: OgStaticPage) {
	return absoluteUrl(pageOgImagePath(page))
}
