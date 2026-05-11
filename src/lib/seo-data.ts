import type { Locale } from '@/lib/i18n/constants'

import { htmlLangFor } from '@/lib/i18n/constants'

export const SITE_URL = 'https://xat.sh'
export const SITE_NAME = 'Xat'
export const DEFAULT_DESCRIPTION
	= 'Design Engineer building AI-native products, interfaces, and frontend systems.'
/** Direct CDN URL avoids `github.com/...png` redirect and improves LCP discovery. */
export const PROFILE_AVATAR_SRC = 'https://avatars.githubusercontent.com/u/54651817?s=128&v=4'

export const DEFAULT_OG_IMAGE = 'https://github.com/withxat.png'

/** Twitter handle for `twitter:site` / `twitter:creator` (with leading @). */
export const TWITTER_SITE = '@withxat'

export function absoluteUrl(path = '/') {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	return `${SITE_URL}${normalizedPath}`
}

export function escapeJsonForHtml(value: unknown) {
	return JSON.stringify(value).replaceAll('<', '\\u003C')
}

export function personJsonLd(options?: { description?: string }) {
	const description = options?.description ?? DEFAULT_DESCRIPTION

	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'description': description,
		'image': DEFAULT_OG_IMAGE,
		'jobTitle': 'Design Engineer',
		'name': 'Xat',
		'sameAs': [
			'https://github.com/withxat',
			'https://x.com/withxat',
			'https://t.me/withxat',
		],
		'url': SITE_URL,
	}
}

export function websiteJsonLd(options?: { description?: string }) {
	const description = options?.description ?? DEFAULT_DESCRIPTION

	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'description': description,
		'name': SITE_NAME,
		'url': SITE_URL,
	}
}

export function blogPostingJsonLd({
	articleSection,
	canonicalPath,
	date,
	description,
	image,
	locale,
	tags,
	title,
}: {
	articleSection?: string
	canonicalPath: string
	date: Date
	description: string
	image?: string
	locale: Locale
	tags: string[]
	title: string
}) {
	const url = absoluteUrl(canonicalPath)
	const resolvedImage = image ?? DEFAULT_OG_IMAGE
	const inLanguage = htmlLangFor(locale)

	const node: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'author': {
			'@type': 'Person',
			'name': 'Xat',
			'url': SITE_URL,
		},
		'dateModified': date.toISOString(),
		'datePublished': date.toISOString(),
		description,
		'headline': title,
		'image': resolvedImage,
		inLanguage,
		'keywords': tags,
		'mainEntityOfPage': {
			'@id': url,
			'@type': 'WebPage',
		},
		'publisher': {
			'@type': 'Person',
			'name': 'Xat',
			'url': SITE_URL,
		},
		url,
	}

	if (articleSection) {
		node.articleSection = articleSection
	}

	return node
}

export function articleBreadcrumbJsonLd(
	items: Array<{ name: string, path: string }>,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': items.map((item, index) => ({
			'@type': 'ListItem',
			'item': absoluteUrl(item.path),
			'name': item.name,
			'position': index + 1,
		})),
	}
}
