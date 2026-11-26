import type { Locale } from '@/lib/i18n/constants'

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse as parseYaml } from 'yaml'

import { getMessages } from '@/lib/i18n/messages'

const root = fileURLToPath(new URL('../../..', import.meta.url))

export interface PostOgFrontmatter {
	category: string
	date: Date
	locale: Locale
	slug: string
	summary: string
	title: string
}

function formatOgDate(date: Date, locale: Locale) {
	const day = date.getUTCDate()
	const month = date.getUTCMonth() + 1
	const year = date.getUTCFullYear()

	if (locale === 'zh' || locale === 'ja')
		return `${year} 年 ${month} 月 ${day} 日`

	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
		year: 'numeric',
	}).format(date)
}

function parseFrontmatter(filePath: string, slug: string, locale: Locale): PostOgFrontmatter {
	const raw = readFileSync(filePath, 'utf8')
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match)
		throw new Error(`Missing frontmatter in ${filePath}`)

	const data = parseYaml(match[1]!) as Record<string, unknown>
	const title = String(data.title ?? '').trim()
	const summary = String(data.summary ?? '').trim()
	const category = String(data.category ?? '').trim()
	const date = new Date(String(data.date ?? ''))

	if (!title || !summary || !category || Number.isNaN(date.getTime()))
		throw new Error(`Incomplete frontmatter in ${filePath}`)

	return { category, date, locale, slug, summary, title }
}

export function loadPostsForOg(locale: Locale): PostOgFrontmatter[] {
	const postsDir = join(root, 'content/posts', locale)
	const files = readdirSync(postsDir).filter(name => name.endsWith('.mdx'))
	return files.map((file) => {
		const slug = file.replace(/\.mdx$/, '')
		return parseFrontmatter(join(postsDir, file), slug, locale)
	})
}

export function toPostOgContent(post: PostOgFrontmatter) {
	const categories = getMessages(post.locale).categories
	const categoryLabel = categories[post.category as keyof typeof categories]?.name ?? post.category
	return {
		categoryLabel,
		dateLabel: formatOgDate(post.date, post.locale),
		summary: post.summary,
		title: post.title,
	}
}
