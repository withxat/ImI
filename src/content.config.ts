import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const posts = defineCollection({
	loader: glob({ base: './content/posts', pattern: '**/*.mdx' }),
	schema: z.object({
		category: z.string(),
		date: z.coerce.date(),
		summary: z.string(),
		tags: z.array(z.string()),
		title: z.string(),
		translator: z.tuple([z.enum(['openai', 'claude', 'gemini', 'qwen']), z.string()]).optional(),
	}),
})

const config = defineCollection({
	loader: file('./content/config.json'),
	schema: z.object({
		capabilities: z.array(z.object({
			emptyState: z.object({
				description: z.string(),
				title: z.string(),
			}).optional(),
			items: z.array(z.object({
				description: z.string(),
				link: z.url().optional(),
				title: z.string(),
			})),
			summary: z.string(),
			title: z.string(),
		})),
		categories: z.array(z.object({
			description: z.string(),
			name: z.string(),
			slug: z.string(),
		})),
	}),
})

export const collections = { config, posts }
