import type { ChangeFreq } from '@astrojs/sitemap'

import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE_URL } from '@/lib/seo-data'

/** Matches RSS/sitemap canonical locale in `blog.ts` (zh posts only). */
const SITEMAP_POST_LOCALE = 'zh'

export interface SitemapPageMeta {
	changefreq: ChangeFreq
	lastmod?: Date
	priority: number
}

export interface SitemapBuildData {
	allowedPathnames: Set<string>
	customPages: string[]
	metaByPathname: Map<string, SitemapPageMeta>
}

interface ZhPostSitemapEntry {
	date: Date
	slug: string
}

function absolutePageUrl(pathname: string) {
	return new URL(pathname, SITE_URL).href
}

/** Normalize sitemap / filter paths (no trailing slash except `/`). */
export function normalizeSitemapPathname(url: string): string {
	const pathname = new URL(url).pathname
	if (pathname === '/')
		return '/'
	return pathname.replace(/\/$/, '')
}

function parseFrontmatterDate(content: string): Date | undefined {
	const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!frontmatter)
		return undefined

	const dateLine = frontmatter[1].match(/^date:\s*(\S+)/m)
	if (!dateLine)
		return undefined

	const parsed = new Date(dateLine[1])
	return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/** Reads zh MDX posts without `astro:content` (unavailable during config load). */
async function loadZhPostsForSitemap(): Promise<ZhPostSitemapEntry[]> {
	const postsDir = join(
		dirname(fileURLToPath(import.meta.url)),
		`../../content/posts/${SITEMAP_POST_LOCALE}`,
	)
	const entries = await readdir(postsDir, { withFileTypes: true })
	const posts: ZhPostSitemapEntry[] = []

	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith('.mdx'))
			continue

		const slug = entry.name.replace(/\.mdx$/, '')
		const raw = await readFile(join(postsDir, entry.name), 'utf8')
		const date = parseFrontmatterDate(raw)
		if (!date)
			throw new Error(`Missing or invalid date in ${entry.name}`)

		posts.push({ date, slug })
	}

	return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/** Build-time URLs and per-path metadata for @astrojs/sitemap (zh canonical posts). */
export async function buildSitemapData(): Promise<SitemapBuildData> {
	const posts = await loadZhPostsForSitemap()
	const latestPostDate = posts[0]?.date

	const metaByPathname = new Map<string, SitemapPageMeta>([
		['/', { changefreq: 'monthly', lastmod: latestPostDate, priority: 1 }],
		['/post', { changefreq: 'weekly', lastmod: latestPostDate, priority: 0.8 }],
		...posts.map(post => [
			`/post/${post.slug}`,
			{ changefreq: 'yearly' as const, lastmod: post.date, priority: 0.7 },
		] as const),
	])

	const allowedPathnames = new Set(metaByPathname.keys())
	const customPages = [...allowedPathnames].map(absolutePageUrl)

	return {
		allowedPathnames,
		customPages,
		metaByPathname,
	}
}
