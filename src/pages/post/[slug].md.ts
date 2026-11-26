import type { APIRoute } from 'astro'

import type { Locale } from '@/lib/i18n/constants'

import { markdownResponse, renderPostMarkdown } from '@/lib/markdown'

export const prerender = false

export const GET: APIRoute = async ({ locals, params }) => {
	const slug = params.slug
	if (!slug)
		return new Response('Not found', { status: 404 })

	const locale = (locals.locale ?? 'en') as Locale
	const markdown = await renderPostMarkdown(slug, locale)
	if (!markdown)
		return new Response('Not found', { status: 404 })

	return markdownResponse(markdown)
}
