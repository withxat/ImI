import type { PostWithMeta } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/constants'

import rss from '@astrojs/rss'
import rehypeStringify from 'rehype-stringify'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import { htmlLangFor } from '@/lib/i18n/constants'
import { getMessages } from '@/lib/i18n/messages'

const SITE_URL = 'https://xat.sh'
const RSS_CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400'

interface Post {
	date: Date
	entry?: PostWithMeta['entry']
	slug: string
	summary: string
	tags: string[]
	title: string
}

function postPath(post: Pick<Post, 'slug'>) {
	return `/post/${post.slug}`
}

function postContent(post: Pick<Post, 'summary'>) {
	return `<p>${post.summary}</p>`
}

async function rssContentHtml(post: Post) {
	if (!post.entry?.body)
		return postContent(post)

	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkCjkFriendly)
		.use(remarkCjkFriendlyGfmStrikethrough)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(post.entry.body)
	const html = String(file)

	return html.replaceAll(/\b(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`)
}

export async function generateRssFeed(posts: Post[], locale: Locale) {
	const m = getMessages(locale)
	const channelTitle = m.blog.pageTitle
	const channelDescription = m.blog.pageDescription
	const xmlLang = htmlLangFor(locale)

	const items = await Promise.all(posts.map(async (post) => {
		const content = await rssContentHtml(post)

		return {
			categories: post.tags,
			content,
			description: post.summary,
			link: postPath(post),
			pubDate: post.date,
			title: post.title,
		}
	}))

	const response = await rss({
		customData: `<language>${xmlLang}</language>`,
		description: channelDescription,
		items,
		site: SITE_URL,
		stylesheet: '/rss.xsl',
		title: channelTitle,
		trailingSlash: false,
	})
	response.headers.set('Cache-Control', RSS_CACHE_CONTROL)
	response.headers.set('Content-Type', 'application/rss+xml; charset=utf-8')
	return response
}

/** Default feed URL (Chinese); existing subscribers stay on this path. */
export const RSS_FEED_URL = `${SITE_URL}/feed.xml`

export const RSS_FEED_URL_EN = `${SITE_URL}/feed.en.xml`

export const RSS_FEED_URL_JA = `${SITE_URL}/feed.ja.xml`
