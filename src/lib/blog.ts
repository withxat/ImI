import type { Locale } from '@/lib/i18n/constants'

import { allPosts, config } from 'content-collections'

export const BLOG_CATEGORIES = config.categories

/** RSS and sitemap use Chinese posts as the canonical writing locale. */
export const BLOG_PRIMARY_LOCALE: Locale = 'zh'

function allPostsSorted() {
	return [...allPosts].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getAllPosts(locale: Locale) {
	return allPostsSorted().filter(post => post.locale === locale)
}

export function getPostSlugs() {
	return [...new Set(allPostsSorted().map(post => post.slug))]
}

export function getPostBySlug(slug: string, locale: Locale) {
	return allPostsSorted().find(post => post.slug === slug && post.locale === locale)
}

export function getCategoryBySlug(slug: string) {
	return BLOG_CATEGORIES.find(category => category.slug === slug)
}

export function getPostsByCategory(locale: Locale) {
	const posts = getAllPosts(locale)

	return BLOG_CATEGORIES
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
