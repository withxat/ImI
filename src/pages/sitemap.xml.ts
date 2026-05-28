import type { APIRoute } from 'astro'

import { BLOG_PRIMARY_LOCALE, getAllPosts } from '@/lib/blog'
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

export const GET: APIRoute = async () => {
	const posts = await getAllPosts(BLOG_PRIMARY_LOCALE)
	const latestPostDate = posts[0]?.date
	const entries: SitemapEntry[] = [
		{ changefreq: 'monthly', lastmod: latestPostDate, path: '/', priority: 1 },
		{ changefreq: 'weekly', lastmod: latestPostDate, path: '/post', priority: 0.8 },
		...posts.map(post => ({
			changefreq: 'yearly' as const,
			lastmod: post.date,
			path: `/post/${post.slug}`,
			priority: 0.7,
		})),
	]

	return new Response(
		[
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...entries.map(createUrlEntry),
			'</urlset>',
		].join(''),
		{
			headers: {
				'Cache-Control': 'public, max-age=3600, s-maxage=86400',
				'Content-Type': 'application/xml; charset=utf-8',
			},
		},
	)
}
