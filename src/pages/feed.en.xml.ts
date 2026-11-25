import type { APIRoute } from 'astro'

import { getAllPosts } from '@/lib/blog'
import { generateRssFeed } from '@/lib/rss'

export const prerender = true

export const GET: APIRoute = async () => {
	const posts = await getAllPosts('en')
	return generateRssFeed(posts, 'en')
}
