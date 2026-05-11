import type { ReactNode } from 'react'

import type { Locale } from '@/lib/i18n/constants'

import { htmlLangFor, LOCALES, ogLocaleFor } from '@/lib/i18n/constants'
import {
	absoluteUrl,
	DEFAULT_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	escapeJsonForHtml,
	SITE_NAME,
	TWITTER_SITE,
} from '@/lib/seo-data'

interface SeoProps {
	canonicalPath: string
	children?: ReactNode
	description?: string
	image?: string
	jsonLd?: unknown | unknown[]
	locale: Locale
	title: string
	type?: 'article' | 'profile' | 'website'
}

export function Seo({
	canonicalPath,
	children,
	description = DEFAULT_DESCRIPTION,
	image = DEFAULT_OG_IMAGE,
	jsonLd,
	locale,
	title,
	type = 'website',
}: SeoProps) {
	const canonicalUrl = absoluteUrl(canonicalPath)
	const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
	const contentLanguage = htmlLangFor(locale)
	const primaryOgLocale = ogLocaleFor(locale)

	return (
		<>
			<title>{title}</title>
			<meta content={description} name="description" />
			<meta content={contentLanguage} httpEquiv="content-language" />
			<link href={canonicalUrl} rel="canonical" />
			<meta content={SITE_NAME} property="og:site_name" />
			<meta content={type} property="og:type" />
			<meta content={title} property="og:title" />
			<meta content={description} property="og:description" />
			<meta content={canonicalUrl} property="og:url" />
			<meta content={image} property="og:image" />
			<meta content={primaryOgLocale} property="og:locale" />
			{LOCALES.filter(l => l !== locale).map(l => (
				<meta content={ogLocaleFor(l)} key={l} property="og:locale:alternate" />
			))}
			<meta content="summary" name="twitter:card" />
			<meta content={TWITTER_SITE} name="twitter:site" />
			<meta content={TWITTER_SITE} name="twitter:creator" />
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
