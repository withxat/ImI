import { absoluteUrl } from '@/lib/seo-data'

export const DEFAULT_OG_IMAGE_PATH = '/og/default.png'

export function postOgImagePath(slug: string) {
	return `/og/post/${slug}.png`
}

export function defaultOgImageUrl() {
	return absoluteUrl(DEFAULT_OG_IMAGE_PATH)
}

export function postOgImageUrl(slug: string) {
	return absoluteUrl(postOgImagePath(slug))
}
