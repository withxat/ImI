import type { APIRoute } from 'astro'

import { BLOG_PRIMARY_LOCALE, getAllPosts } from '@/lib/blog'
import { generateRssFeed } from '@/lib/rss'

export const GET: APIRoute = async () => {
	const posts = await getAllPosts(BLOG_PRIMARY_LOCALE)
	return new Response(generateRssFeed(posts, BLOG_PRIMARY_LOCALE), {
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	})
}
