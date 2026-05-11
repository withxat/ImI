import type { Locale } from '@/lib/i18n/constants'

import { allPosts, config } from 'content-collections'

import { intlLocaleFor } from '@/lib/i18n/constants'

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

export function formatPostDate(date: Date, locale: Locale) {
	return new Intl.DateTimeFormat(intlLocaleFor(locale), {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}
