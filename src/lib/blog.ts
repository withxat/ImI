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

export async function getBlogCategories(): Promise<BlogCategory[]> {
	const cfg = await getConfigEntry()
	return cfg?.data.categories ?? []
}

/** RSS and sitemap use Chinese posts as the canonical writing locale. */
export const BLOG_PRIMARY_LOCALE: Locale = 'zh'

async function allPostsSorted(): Promise<PostEntry[]> {
	const posts = await getPostsCollection()
	return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getAllPosts(locale: Locale) {
	const posts = await allPostsSorted()
	return posts
		.map((entry) => {
			const parsed = parsePostId(entry.id)
			if (!parsed)
				return null
			return {
				...entry.data,
				entry,
				locale: parsed.locale,
				slug: parsed.slug,
			}
		})
		.filter((post): post is NonNullable<typeof post> => post !== null)
		.filter(post => post.locale === locale)
}

export async function getPostSlugs() {
	const posts = await allPostsSorted()
	const slugs = posts
		.map(entry => parsePostId(entry.id)?.slug)
		.filter(Boolean)
	return [...new Set(slugs)]
}

export async function getPostBySlug(slug: string, locale: Locale) {
	const posts = await getAllPosts(locale)
	return posts.find(post => post.slug === slug)
}

export async function getCategoryBySlug(slug: string) {
	const categories = await getBlogCategories()
	return categories.find(category => category.slug === slug)
}

export async function getPostsByCategory(locale: Locale) {
	const [posts, categories] = await Promise.all([
		getAllPosts(locale),
		getBlogCategories(),
	])

	return categories
		.map(category => ({
			category,
			posts: posts.filter(post => post.category === category.slug),
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
