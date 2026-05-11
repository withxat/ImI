import type { ReactNode } from 'react'

import {
	absoluteUrl,
	DEFAULT_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	escapeJsonForHtml,
	SITE_NAME,
} from '@/lib/seo-data'

interface SeoProps {
	canonicalPath: string
	children?: ReactNode
	description?: string
	image?: string
	jsonLd?: unknown | unknown[]
	title: string
	type?: 'article' | 'profile' | 'website'
}

export function Seo({
	canonicalPath,
	children,
	description = DEFAULT_DESCRIPTION,
	image = DEFAULT_OG_IMAGE,
	jsonLd,
	title,
	type = 'website',
}: SeoProps) {
	const canonicalUrl = absoluteUrl(canonicalPath)
	const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

	return (
		<>
			<title>{title}</title>
			<meta content={description} name="description" />
			<link href={canonicalUrl} rel="canonical" />
			<meta content={SITE_NAME} property="og:site_name" />
			<meta content={type} property="og:type" />
			<meta content={title} property="og:title" />
			<meta content={description} property="og:description" />
			<meta content={canonicalUrl} property="og:url" />
			<meta content={image} property="og:image" />
			<meta content="summary" name="twitter:card" />
			<meta content={title} name="twitter:title" />
			<meta content={description} name="twitter:description" />
			<meta content={image} name="twitter:image" />
			{jsonLdItems.map(item => (
				<script key={escapeJsonForHtml(item)} type="application/ld+json">
					{escapeJsonForHtml(item)}
				</script>
			))}
			{children}
		</>
	)
}
