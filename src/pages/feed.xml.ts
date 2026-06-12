import type { APIRoute } from 'astro'

import { BLOG_PRIMARY_LOCALE, getAllPosts } from '@/lib/blog'
import { generateRssFeed } from '@/lib/rss'

export const GET: APIRoute = async () => {
	const posts = await getAllPosts(BLOG_PRIMARY_LOCALE)
	return generateRssFeed(posts, BLOG_PRIMARY_LOCALE)
}
