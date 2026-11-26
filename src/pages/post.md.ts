import type { APIRoute } from 'astro'

import type { Locale } from '@/lib/i18n/constants'

import { markdownResponse, renderPostListMarkdown } from '@/lib/markdown'

export const prerender = false

export const GET: APIRoute = async ({ locals }) => {
	const locale = (locals.locale ?? 'en') as Locale
	return markdownResponse(await renderPostListMarkdown(locale))
}
