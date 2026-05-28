import type { Locale } from '@/lib/i18n/constants'

import { htmlLangFor } from '@/lib/i18n/constants'
import { getMessages } from '@/lib/i18n/messages'

const SITE_URL = 'https://xat.sh'

interface Post {
	date: Date
	slug: string
	summary: string
	tags: string[]
	title: string
}

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
	return `${SITE_URL}/post/${post.slug}`
}

function postContent(post: Pick<Post, 'summary'>) {
	return `<p>${escapeXml(post.summary)}</p>`
}

export function generateRssFeed(posts: Post[], locale: Locale) {
	const m = getMessages(locale)
	const channelTitle = m.blog.pageTitle
	const channelDescription = m.blog.pageDescription
	const xmlLang = escapeXml(htmlLangFor(locale))

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
		`<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xml:lang="${xmlLang}">`,
		'<channel>',
		`<title>${escapeXml(channelTitle)}</title>`,
		`<description>${escapeXml(channelDescription)}</description>`,
		`<link>${SITE_URL}</link>`,
		...items,
		'</channel>',
		'</rss>',
	].join('')
}

/** Default feed URL (Chinese); existing subscribers stay on this path. */
export const RSS_FEED_URL = `${SITE_URL}/feed.xml`

export const RSS_FEED_URL_EN = `${SITE_URL}/feed.en.xml`

export const RSS_FEED_URL_JA = `${SITE_URL}/feed.ja.xml`
