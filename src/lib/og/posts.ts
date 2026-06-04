import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse as parseYaml } from 'yaml'

const root = fileURLToPath(new URL('../../..', import.meta.url))
const zhPostsDir = join(root, 'content/posts/zh')

export interface ZhPostFrontmatter {
	category: string
	date: Date
	slug: string
	summary: string
	title: string
}

function formatZhOgDate(date: Date) {
	const day = date.getUTCDate()
	const month = date.getUTCMonth() + 1
	const year = date.getUTCFullYear()
	return `${year} 年 ${month} 月 ${day} 日`
}

function parseFrontmatter(filePath: string, slug: string): ZhPostFrontmatter {
	const raw = readFileSync(filePath, 'utf8')
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match)
		throw new Error(`Missing frontmatter in ${filePath}`)

	const data = parseYaml(match[1]) as Record<string, unknown>
	const title = String(data.title ?? '').trim()
	const summary = String(data.summary ?? '').trim()
	const category = String(data.category ?? '').trim()
	const date = new Date(String(data.date ?? ''))

	if (!title || !summary || !category || Number.isNaN(date.getTime()))
		throw new Error(`Incomplete frontmatter in ${filePath}`)

	return { category, date, slug, summary, title }
}

export function loadZhPostsForOg(): ZhPostFrontmatter[] {
	const files = readdirSync(zhPostsDir).filter(name => name.endsWith('.mdx'))
	return files.map((file) => {
		const slug = file.replace(/\.mdx$/, '')
		return parseFrontmatter(join(zhPostsDir, file), slug)
	})
}

export function toPostOgContent(post: ZhPostFrontmatter) {
	return {
		category: post.category,
		dateLabel: formatZhOgDate(post.date),
		summary: post.summary,
		title: post.title,
	}
}
