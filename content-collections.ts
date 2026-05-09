import { defineCollection, defineConfig, defineSingleton } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'

const posts = defineCollection({
	directory: 'content/posts',
	include: '**/*.mdx',
	name: 'posts',
	schema: z.object({
		category: z.string(),
		content: z.string(),
		date: z.coerce.date(),
		summary: z.string(),
		tags: z.array(z.string()),
		title: z.string(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document)
		return {
			...document,
			mdx,
			slug: document._meta.fileName,
		}
	},
})

const config = defineSingleton({
	filePath: 'content/config.json',
	name: 'config',
	parser: 'json',
	schema: z.object({
		categories: z.array(z.object({
			description: z.string(),
			name: z.string(),
			slug: z.string(),
		})),
		projects: z.array(z.object({
			description: z.string(),
			link: z.string(),
			title: z.string(),
		})),
	}),
})

export default defineConfig({
	content: [posts, config],
})
