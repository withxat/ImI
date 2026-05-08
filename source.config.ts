import { defineCollections } from 'fumadocs-mdx/config'
import { z } from 'zod'

export const blog = defineCollections({
	dir: './content/blog',
	schema: z.object({
		category: z.string(),
		date: z.coerce.date(),
		summary: z.string(),
		tags: z.array(z.string()),
		title: z.string(),
	}),
	type: 'doc',
})
