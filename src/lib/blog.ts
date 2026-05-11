import type { Locale } from '@/lib/i18n/constants'

import { allPosts, config } from 'content-collections'

export const BLOG_CATEGORIES = config.categories

export function getAllPosts() {
	return allPosts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getPostSlugs() {
	return getAllPosts().map(post => post.slug)
}

export function getPostBySlug(slug: string) {
	return getAllPosts().find(post => post.slug === slug)
}

export function getCategoryBySlug(slug: string) {
	return BLOG_CATEGORIES.find(category => category.slug === slug)
}

export function getPostsByCategory() {
	const posts = getAllPosts()

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
		return `${year}年${month}月${day}日`
	}

	if (locale === 'ja') {
		return `${year}年${month}月${day}日`
	}

	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
		year: 'numeric',
	}).format(date)
}
