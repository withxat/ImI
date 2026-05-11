import type { allPosts } from 'content-collections'

import { DEFAULT_LOCALE } from '@/lib/i18n/constants'
import { withLocale } from '@/lib/i18n/paths'

const SITE_URL = 'https://xat.sh'
const FEED_TITLE = 'Hi, Xat!'
const FEED_DESCRIPTION = 'Code with Love, Exploring the World.'

type Post = (typeof allPosts)[number]

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;')
}

function escapeCdata(value: string) {
	return value.replaceAll(']]>', ']]]]><![CDATA[>')
}

function postUrl(post: Pick<Post, 'slug'>) {
	const path = withLocale(DEFAULT_LOCALE, `/post/${post.slug}`)
	return `${SITE_URL}${path}`
}

function postContent(post: Pick<Post, 'summary'>) {
	return `<p>${escapeXml(post.summary)}</p>`
}

export function generateRssFeed(posts: Post[]) {
	const items = posts.map((post) => {
		const link = postUrl(post)
		const content = postContent(post)

		return [
			'<item>',
			`<title>${escapeXml(post.title)}</title>`,
			`<link>${escapeXml(link)}</link>`,
			`<guid isPermaLink="true">${escapeXml(link)}</guid>`,
			`<description>${escapeXml(post.summary)}</description>`,
			`<pubDate>${post.date.toUTCString()}</pubDate>`,
			`<content:encoded><![CDATA[${escapeCdata(content)}]]></content:encoded>`,
			...post.tags.map(tag => `<category>${escapeXml(tag)}</category>`),
			'</item>',
		].join('')
	})

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>',
		'<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
		'<channel>',
		`<title>${escapeXml(FEED_TITLE)}</title>`,
		`<description>${escapeXml(FEED_DESCRIPTION)}</description>`,
		`<link>${SITE_URL}${withLocale(DEFAULT_LOCALE, '/')}</link>`,
		...items,
		'</channel>',
		'</rss>',
	].join('')
}

export const RSS_FEED_URL = `${SITE_URL}/feed.xml`
export const RSS_TITLE = FEED_TITLE
