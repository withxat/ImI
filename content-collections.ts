import type { MDXContent } from 'mdx/types'

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { createDefaultImport, defineCollection, defineConfig, defineSingleton } from '@content-collections/core'
import { compile } from '@mdx-js/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

import { isLocale, LOCALES } from '@/lib/i18n/constants'

async function createMdxImport(compilationKey: string, content: string) {
	const safeKey = compilationKey.replaceAll(/[^\w-]+/g, '_')
	const outputPath = join('.content-collections', 'mdx', `${safeKey}.js`)
	const compiled = await compile(content, {
		development: false,
		outputFormat: 'program',
		providerImportSource: undefined,
		rehypePlugins: [
			[
				rehypePrettyCode,
				{
					bypassInlineCode: true,
					defaultLang: 'plaintext',
					keepBackground: false,
					theme: 'vesper',
				},
			],
		],
		remarkPlugins: [remarkGfm, remarkCjkFriendly, remarkCjkFriendlyGfmStrikethrough],
	})

	await mkdir(dirname(outputPath), { recursive: true })
	await writeFile(outputPath, String(compiled))

	return createDefaultImport<MDXContent>(`../mdx/${safeKey}.js`)
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
		const segments = document._meta.path.split('/')
		const localeSegment = segments[0]
		if (!localeSegment || !isLocale(localeSegment)) {
			throw new Error(`Post path must start with a locale (${LOCALES.join(', ')}): ${document._meta.path}`)
		}

		const locale = localeSegment
		const slug = segments.slice(1).join('/')
		if (!slug) {
			throw new Error(`Post path must include a slug after the locale folder: ${document._meta.path}`)
		}

		const compilationKey = `${locale}__${slug.replaceAll('/', '__')}`
		const mdx = await createMdxImport(compilationKey, document.content)

		return {
			...document,
			locale,
			mdx,
			slug,
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
