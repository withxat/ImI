import { blog } from 'collections/server'

export const BLOG_CATEGORIES = {
	design: {
		description: 'Satisfying my aesthetic',
		name: 'Design',
	},
	life: {
		description: 'Bubbles of simple life',
		name: 'Life',
	},
	tech: {
		description: 'Thoughts on technology',
		name: 'Tech',
	},
} as const

export type BlogCategorySlug = keyof typeof BLOG_CATEGORIES
export type BlogPost = (typeof blog)[number]

export function getAllPosts() {
	return [...blog].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getPostSlugs() {
	return getAllPosts().map(post => post.info.path.replace(/\.mdx?$/, ''))
}

export function getPostBySlug(slug: string) {
	return getAllPosts().find(post => post.info.path.replace(/\.mdx?$/, '') === slug)
}

export function getPostsByCategory() {
	const posts = getAllPosts()

	return Object.entries(BLOG_CATEGORIES)
		.map(([slug, category]) => ({
			category: {
				...category,
				slug: slug as BlogCategorySlug,
			},
			posts: posts.filter(post => post.category === slug),
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
