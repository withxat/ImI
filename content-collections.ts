import type { MDXContent } from 'mdx/types'

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { createDefaultImport, defineCollection, defineConfig, defineSingleton } from '@content-collections/core'
import { compile } from '@mdx-js/mdx'
import remarkCjkFriendly from 'remark-cjk-friendly'
import { z } from 'zod'

async function createMdxImport(slug: string, content: string) {
	const outputPath = join('.content-collections', 'mdx', `${slug}.js`)
	const compiled = await compile(content, {
		development: false,
		outputFormat: 'program',
		providerImportSource: undefined,
		remarkPlugins: [remarkCjkFriendly],
	})

	await mkdir(dirname(outputPath), { recursive: true })
	await writeFile(outputPath, String(compiled))

	return createDefaultImport<MDXContent>(`../mdx/${slug}.js`)
}

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
	transform: async (document) => {
		const mdx = await createMdxImport(document._meta.path, document.content)

		return {
			...document,
			mdx,
			slug: document._meta.path,
		}
	},
})

const config = defineSingleton({
	filePath: 'content/config.json',
	name: 'config',
	parser: 'json',
	schema: z.object({
		capabilities: z.array(z.object({
			emptyState: z.object({
				description: z.string(),
				title: z.string(),
			}).optional(),
			items: z.array(z.object({
				description: z.string(),
				link: z.string().url().optional(),
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

export default defineConfig({
	content: [posts, config],
})
