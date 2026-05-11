import { getAllPosts } from '@/lib/blog'
import { LOCALES } from '@/lib/i18n/constants'
import { withLocale } from '@/lib/i18n/paths'
import { absoluteUrl } from '@/lib/seo-data'

interface SitemapEntry {
	changefreq?: 'daily' | 'monthly' | 'weekly' | 'yearly'
	lastmod?: Date
	path: string
	priority?: number
}

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;')
}

function createUrlEntry({ changefreq, lastmod, path, priority }: SitemapEntry) {
	const fields = [
		`<loc>${escapeXml(absoluteUrl(path))}</loc>`,
		lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : null,
		changefreq ? `<changefreq>${changefreq}</changefreq>` : null,
		typeof priority === 'number' ? `<priority>${priority.toFixed(1)}</priority>` : null,
	].filter(Boolean)

	return `<url>${fields.join('')}</url>`
}

export function GET() {
	const posts = getAllPosts()
	const latestPostDate = posts[0]?.date
	const localeHomes = LOCALES.map(locale => ({
		changefreq: 'monthly' as const,
		lastmod: latestPostDate,
		path: withLocale(locale, '/'),
		priority: 1,
	}))
	const localeBlogIndexes = LOCALES.map(locale => ({
		changefreq: 'weekly' as const,
		lastmod: latestPostDate,
		path: withLocale(locale, '/post'),
		priority: 0.8,
	}))
	const postEntries = LOCALES.flatMap(locale =>
		posts.map(post => ({
			changefreq: 'yearly' as const,
			lastmod: post.date,
			path: withLocale(locale, `/post/${post.slug}`),
			priority: 0.7,
		})),
	)
	const entries: SitemapEntry[] = [...localeHomes, ...localeBlogIndexes, ...postEntries]

	return new Response([
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map(createUrlEntry),
		'</urlset>',
	].join(''), {
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
