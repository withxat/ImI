import { blog } from 'collections/server'

import categories from '../../content/categories.json'

export type BlogPost = (typeof blog)[number]
export type BlogCategory = (typeof categories)[number]
export type BlogCategorySlug = BlogCategory['slug']

export const BLOG_CATEGORIES = categories

export function getAllPosts() {
	return [...blog].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getPostSlugs() {
	return getAllPosts().map(post => post.info.path.replace(/\.mdx?$/, ''))
}

export function getPostBySlug(slug: string) {
	return getAllPosts().find(post => post.info.path.replace(/\.mdx?$/, '') === slug)
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

export function formatPostDate(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}
