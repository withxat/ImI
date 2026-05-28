import type { APIRoute } from 'astro'

import { getAllPosts } from '@/lib/blog'
import { generateRssFeed } from '@/lib/rss'

export const GET: APIRoute = async () => {
	const posts = await getAllPosts('ja')
	return new Response(generateRssFeed(posts, 'ja'), {
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	})
}
