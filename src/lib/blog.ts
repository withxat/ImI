import type { CollectionEntry } from 'astro:content'

import type { Locale } from '@/lib/i18n/constants'

import { getCollection } from 'astro:content'

type PostEntry = CollectionEntry<'posts'>
type ConfigEntry = CollectionEntry<'config'>

let postsPromise: Promise<PostEntry[]> | undefined
let configPromise: Promise<ConfigEntry | null> | undefined

function getPostsCollection(): Promise<PostEntry[]> {
	postsPromise ??= getCollection('posts') as Promise<PostEntry[]>
	return postsPromise
}

function getConfigEntry(): Promise<ConfigEntry | null> {
	configPromise ??= (getCollection('config') as Promise<ConfigEntry[]>).then(entries => entries[0] ?? null)
	return configPromise
}

function parsePostId(id: string): null | { locale: Locale, slug: string } {
	const segments = id.split('/')
	const locale = segments[0]
	if (locale !== 'en' && locale !== 'zh' && locale !== 'ja')
		return null
	const slug = segments.slice(1).join('/')
	if (!slug)
		return null
	return { locale, slug }
}

export type BlogCategory = ConfigEntry['data']['categories'][number]

export type PostWithMeta = PostEntry['data'] & {
	entry: PostEntry
	locale: Locale
	slug: string
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
	const cfg = await getConfigEntry()
	return cfg?.data.categories ?? []
}

/** RSS and sitemap use Chinese posts as the canonical writing locale. */
export const BLOG_PRIMARY_LOCALE: Locale = 'zh'

/** Cached post index per locale. Built once, reused for all lookups. */
const postIndexCache = new Map<Locale, {
	all: PostWithMeta[]
	byCategory: Map<string, PostWithMeta[]>
	bySlug: Map<string, PostWithMeta>
	slugs: string[]
}>()

async function buildPostIndex(locale: Locale) {
	const existing = postIndexCache.get(locale)
	if (existing)
		return existing

	const posts = await getPostsCollection()
	const sorted = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

	const all: PostWithMeta[] = []
	const bySlug = new Map<string, PostWithMeta>()
	const byCategory = new Map<string, PostWithMeta[]>()
	const allSlugs = new Set<string>()

	for (const entry of sorted) {
		const parsed = parsePostId(entry.id)
		if (!parsed)
			continue

		allSlugs.add(parsed.slug)

		if (parsed.locale !== locale)
			continue

		const post: PostWithMeta = {
			...entry.data,
			entry,
			locale: parsed.locale,
			slug: parsed.slug,
		}

		all.push(post)
		bySlug.set(parsed.slug, post)

		const categoryPosts = byCategory.get(post.category) ?? []
		categoryPosts.push(post)
		byCategory.set(post.category, categoryPosts)
	}

	const index = {
		all,
		byCategory,
		bySlug,
		slugs: [...allSlugs],
	}

	postIndexCache.set(locale, index)
	return index
}

export async function getAllPosts(locale: Locale): Promise<PostWithMeta[]> {
	const index = await buildPostIndex(locale)
	return index.all
}

export async function getPostSlugs(): Promise<string[]> {
	// Need to scan all posts for slugs regardless of locale
	const posts = await getPostsCollection()
	const slugs = new Set<string>()
	for (const entry of posts) {
		const parsed = parsePostId(entry.id)
		if (parsed)
			slugs.add(parsed.slug)
	}
	return [...slugs]
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<PostWithMeta | undefined> {
	const index = await buildPostIndex(locale)
	return index.bySlug.get(slug)
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
	const categories = await getBlogCategories()
	return categories.find(category => category.slug === slug)
}

export async function getPostsByCategory(locale: Locale) {
	const [index, categories] = await Promise.all([
		buildPostIndex(locale),
		getBlogCategories(),
	])

	return categories
		.map(category => ({
			category,
			posts: index.byCategory.get(category.slug) ?? [],
		}))
		.filter(group => group.posts.length > 0)
}

function utcCalendarParts(date: Date) {
	return {
		day: date.getUTCDate(),
		month: date.getUTCMonth() + 1,
		year: date.getUTCFullYear(),
	}
}

/** Formats the post's calendar date (YAML `date` is treated as UTC midnight). */
export function formatPostDate(date: Date, locale: Locale) {
	const { day, month, year } = utcCalendarParts(date)

	if (locale === 'zh') {
		return `${year} 年 ${month} 月 ${day} 日`
	}

	if (locale === 'ja') {
		return `${year} 年 ${month} 月 ${day} 日`
	}

	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
		year: 'numeric',
	}).format(date)
}
