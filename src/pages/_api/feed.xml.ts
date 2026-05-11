import { BLOG_PRIMARY_LOCALE, getAllPosts } from '@/lib/blog'
import { generateRssFeed } from '@/lib/rss'

export function GET() {
	return new Response(generateRssFeed(getAllPosts(BLOG_PRIMARY_LOCALE)), {
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	})
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
