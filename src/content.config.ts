import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const posts = defineCollection({
	loader: glob({ base: './content/posts', pattern: '**/*.mdx' }),
	schema: z.object({
		category: z.string(),
		date: z.coerce.date(),
		seoDescription: z.string().optional(),
		summary: z.string(),
		tags: z.array(z.string()),
		title: z.string(),
		translator: z.tuple([z.enum(['openai', 'claude', 'gemini', 'qwen']), z.string()]).optional(),
		/** Reachable by direct link only: left out of post lists, RSS, and the sitemap. */
		unlisted: z.boolean().optional(),
	}),
})

const config = defineCollection({
	loader: file('./content/config.json'),
	schema: z.object({
		capabilities: z.array(z.object({
			items: z.array(z.object({
				description: z.string(),
				link: z.url().optional(),
				title: z.string(),
			})),
			title: z.string(),
		})),
		categories: z.array(z.object({
			name: z.string(),
			slug: z.string(),
		})),
	}),
})

/** `YYYY-MM`; an omitted end means the role is current. */
const month = z.string().regex(/^\d{4}-\d{2}$/)

/** One file per locale (`content/resume/{en,zh,ja}.yaml`), rendered at /resume. */
const resume = defineCollection({
	loader: glob({ base: './content/resume', pattern: '*.yaml' }),
	schema: z.object({
		contact: z.array(z.object({
			href: z.string(),
			label: z.string(),
		})),
		education: z.array(z.object({
			degree: z.string(),
			major: z.string(),
			school: z.string().optional(),
		})),
		experience: z.array(z.object({
			end: month.optional(),
			organization: z.string(),
			projects: z.array(z.object({
				end: month.optional(),
				highlights: z.array(z.string()),
				name: z.string(),
				stack: z.array(z.string()),
				start: month,
				summary: z.string().optional(),
			})),
			role: z.string(),
			start: month,
			summary: z.string(),
		})),
		openSource: z.array(z.object({
			date: month,
			href: z.url(),
			project: z.string(),
			summary: z.string(),
		})),
		projects: z.array(z.object({
			date: month,
			href: z.url(),
			name: z.string(),
			summary: z.string(),
		})),
		role: z.string(),
		skills: z.array(z.object({
			group: z.string(),
			items: z.array(z.string()),
		})),
		summary: z.string(),
	}),
})

export const collections = { config, posts, resume }
