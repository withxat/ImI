export const SITE_URL = 'https://xat.sh'
export const SITE_NAME = 'Xat'
export const DEFAULT_DESCRIPTION
	= 'Design Engineer building AI-native products, interfaces, and frontend systems.'
export const DEFAULT_OG_IMAGE = 'https://github.com/withxat.png'

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

export function personJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'description': DEFAULT_DESCRIPTION,
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

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'description': DEFAULT_DESCRIPTION,
		'name': SITE_NAME,
		'url': SITE_URL,
	}
}

export function blogPostingJsonLd({
	canonicalPath,
	date,
	description,
	tags,
	title,
}: {
	canonicalPath: string
	date: Date
	description: string
	tags: string[]
	title: string
}) {
	const url = absoluteUrl(canonicalPath)

	return {
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
}
