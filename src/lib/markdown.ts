import type { Locale } from '@/lib/i18n/constants'

import { getEntry } from 'astro:content'

import { formatPostDate, getAllPosts, getPostBySlug, getPostsByYear } from '@/lib/blog'
import { getMessages } from '@/lib/i18n/messages'
import { getCapabilities } from '@/lib/projects'
import { REPO_URL } from '@/lib/repo'
import {
	absoluteUrl,
	RSS_FEED_URL,
	RSS_FEED_URL_EN,
	RSS_FEED_URL_JA,
	SITE_NAME,
	SITE_URL,
} from '@/lib/seo-data'
import { toTranslator } from '@/types/translator'

const CJK_CHAR_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const FENCED_CODE_RE = /(^```[\s\S]+?^```|^~~~[\s\S]+?^~~~)/gm
const NEGOTIABLE_POST_PATH_RE = /^\/post\/([^/.]+)$/

function parseQuality(params: string[]): number {
	for (const param of params) {
		const [key, rawValue] = param.split('=').map(part => part.trim())
		if (key?.toLowerCase() === 'q' && rawValue !== undefined) {
			const value = Number.parseFloat(rawValue)
			return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
		}
	}
	return 1
}

/**
 * Returns true when the client explicitly prefers `text/markdown` over `text/html`
 * per RFC 9110 Accept quality factors (ignores wildcard media ranges).
 */
export function wantsMarkdown(request: Request): boolean {
	if (request.method !== 'GET' && request.method !== 'HEAD')
		return false

	const accept = request.headers.get('accept')
	if (!accept || !accept.toLowerCase().includes('text/markdown'))
		return false

	let markdownQ = 0
	let htmlQ = 0

	for (const part of accept.split(',')) {
		const [rawType, ...params] = part.trim().split(';')
		const mediaType = rawType?.trim().toLowerCase()
		if (mediaType === 'text/markdown')
			markdownQ = Math.max(markdownQ, parseQuality(params))
		else if (mediaType === 'text/html')
			htmlQ = Math.max(htmlQ, parseQuality(params))
	}

	return markdownQ > 0 && markdownQ >= htmlQ
}

export function isMarkdownNegotiablePath(pathname: string): boolean {
	return (
		pathname === '/'
		|| pathname === '/post'
		|| pathname === '/resume'
		|| NEGOTIABLE_POST_PATH_RE.test(pathname)
	)
}

/** Lightweight token count estimate (~1 token per CJK glyph, ~0.25 per Latin char). */
export function estimateMarkdownTokens(markdown: string): number {
	const cjkCount = markdown.match(CJK_CHAR_RE)?.length ?? 0
	const otherCount = Math.max(0, markdown.length - cjkCount)
	return Math.max(1, Math.ceil(cjkCount + otherCount / 4))
}

export function markdownResponse(
	markdown: string,
	options?: { varyAccept?: boolean },
): Response {
	const body = markdown.endsWith('\n') ? markdown : `${markdown}\n`
	const vary = options?.varyAccept
		? 'Accept, Cookie, Accept-Language'
		: 'Cookie, Accept-Language'

	return new Response(body, {
		headers: {
			'Cache-Control': 'public, max-age=600',
			'Content-Type': 'text/markdown; charset=utf-8',
			'Vary': vary,
			'x-markdown-tokens': String(estimateMarkdownTokens(body)),
		},
		status: 200,
	})
}

export function appendVaryHeader(response: Response, value: string): Response {
	const current = response.headers.get('Vary') ?? ''
	const existing = current
		.split(',')
		.map(token => token.trim().toLowerCase())
		.filter(Boolean)

	if (existing.includes(value.toLowerCase()))
		return response

	const nextValue = current ? `${current}, ${value}` : value
	try {
		response.headers.set('Vary', nextValue)
		return response
	}
	catch {
		const copy = new Response(response.body, response)
		copy.headers.set('Vary', nextValue)
		return copy
	}
}

function htmlInlineToMarkdown(html: string): string {
	return html
		.replace(/<a\b[^>]+href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi, (_, doubleHref: string | undefined, singleHref: string | undefined, label: string) => {
			const href = doubleHref ?? singleHref ?? ''
			return `[${label.replace(/<[^>]+>/g, '').trim()}](${href})`
		})
		.replace(/<\/?p\b[^>]*>/gi, '\n')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.join('\n')
}

function convertAccordionBlocks(segment: string): string {
	return segment.replace(/<Accordion\b[^>]*>([\s\S]*?)<\/Accordion>/g, (_, inner: string) => {
		const items: string[] = []
		const itemRe = /<AccordionItem\b[^>]*>([\s\S]*?)<\/AccordionItem>/g
		for (const match of inner.matchAll(itemRe)) {
			const block = match[1] ?? ''
			const trigger = block.match(/<AccordionTrigger\b[^>]*>([\s\S]*?)<\/AccordionTrigger>/)?.[1]?.trim()
			const contentRaw = block.match(/<AccordionContent\b[^>]*>([\s\S]*?)<\/AccordionContent>/)?.[1] ?? ''
			const content = htmlInlineToMarkdown(contentRaw)
			const lines: string[] = []
			if (trigger)
				lines.push(`> **${trigger}**`)
			if (content) {
				if (trigger)
					lines.push('>')
				for (const line of content.split('\n'))
					lines.push(`> ${line}`)
			}
			if (lines.length > 0)
				items.push(lines.join('\n'))
		}
		return items.join('\n\n')
	})
}

/** Cleans MDX-only directives/JSX outside fenced code blocks while preserving Markdown verbatim. */
export function cleanMdxBody(body: string): string {
	const parts = body.split(FENCED_CODE_RE)
	const cleaned = parts.map((part, index) => {
		// Odd indices are captured fenced code blocks — leave them untouched.
		if (index % 2 === 1)
			return part

		return convertAccordionBlocks(part)
			.replace(/<EmojiCompareShot[^>]*alt="([^"]*)"[^/]*\/>/g, (_, alt: string) => `![${alt}](/images/noto-color-emoji-linux-sentence.png)`)
			.replace(/<samp[^>]*emoji-source[^>]*>([\s\S]*?)<\/samp>/gi, (_, inner: string) => inner)
			.replace(/^(?:import|export)\b.*$/gm, '')
			.replace(/\n{3,}/g, '\n\n')
	})

	return cleaned.join('').trim()
}

export async function renderHomeMarkdown(locale: Locale): Promise<string> {
	const m = getMessages(locale)
	const [posts, capabilities] = await Promise.all([
		getAllPosts(locale),
		getCapabilities(),
	])

	const recentPosts = posts.slice(0, 4)
	const projects = capabilities.flatMap((capability, capIndex) => {
		const localizedCap = m.capabilities[capIndex]
		return capability.items.map((item, itemIndex) => {
			const localizedItem = localizedCap?.items[itemIndex]
			return {
				description: localizedItem?.description ?? item.description,
				link: item.link,
				title: localizedItem?.title ?? item.title,
			}
		})
	})

	const lines: string[] = [
		`# ${SITE_NAME} — ${m.home.role}`,
		'',
		`> ${m.home.bioLead}`,
		'',
		m.home.metaDescription,
		'',
		`- Website: ${SITE_URL}`,
		`- ${m.resume.title}: ${absoluteUrl('/resume')} ([Markdown](${absoluteUrl('/resume.md')}))`,
		`- ${m.blog.title}: ${absoluteUrl('/post')} ([Markdown](${absoluteUrl('/post.md')}))`,
		`- ${m.design.eyebrow}: ${absoluteUrl('/design')}`,
		`- GitHub: https://github.com/withxat`,
		`- X / Twitter: https://x.com/withxat`,
		`- Email: mailto:i@xat.sh`,
		'',
		`## ${m.home.writingEyebrow}`,
		'',
		...recentPosts.map(post => `- [${post.title}](${absoluteUrl(`/post/${post.slug}.md`)}) (${post.date.toISOString().slice(0, 10)}) — ${post.summary}`),
		'',
		`## ${m.home.projectsEyebrow}`,
		'',
		...projects.map(project => project.link
			? `- [${project.title}](${project.link}) — ${project.description}`
			: `- ${project.title} — ${project.description}`),
	]

	return lines.join('\n')
}

export async function renderPostListMarkdown(locale: Locale): Promise<string> {
	const m = getMessages(locale)
	const yearGroups = await getPostsByYear(locale)

	const lines: string[] = [
		`# ${m.blog.title}`,
		'',
		`> ${m.blog.pageDescription}`,
		'',
		`Canonical: ${absoluteUrl('/post')}`,
		'',
	]

	for (const group of yearGroups) {
		lines.push(`## ${group.year}`, '')
		for (const post of group.posts) {
			const category = m.categories[post.category as keyof typeof m.categories]?.name ?? post.category
			const date = post.date.toISOString().slice(0, 10)
			lines.push(`- [${post.title}](${absoluteUrl(`/post/${post.slug}.md`)}) — ${date} · ${category}: ${post.summary}`)
		}
		lines.push('')
	}

	return lines.join('\n').trimEnd()
}

export async function renderPostMarkdown(slug: string, locale: Locale): Promise<null | string> {
	const post = await getPostBySlug(slug, locale)
	if (!post)
		return null

	const m = getMessages(locale)
	const category = m.categories[post.category as keyof typeof m.categories]?.name ?? post.category
	const translator = toTranslator(post.translator)
	const canonicalUrl = absoluteUrl(`/post/${post.slug}`)
	const sourceUrl = `${REPO_URL}/blob/main/content/posts/${post.locale}/${post.slug}.mdx`

	const metaLines = [
		`URL: ${canonicalUrl}`,
		`Date: ${formatPostDate(post.date, locale)} (${post.date.toISOString().slice(0, 10)})`,
		`Category: ${category}`,
	]
	if (post.tags.length > 0)
		metaLines.push(`Tags: ${post.tags.join(', ')}`)
	if (translator)
		metaLines.push(`Translator: ${translator[1]}`)
	metaLines.push(`Source: ${sourceUrl}`)

	const body = cleanMdxBody(post.entry.body ?? '')

	return [
		`# ${post.title}`,
		'',
		`> ${post.summary}`,
		'',
		...metaLines,
		'',
		'---',
		'',
		body,
	].join('\n')
}

export async function renderResumeMarkdown(locale: Locale): Promise<string> {
	const m = getMessages(locale)
	const entry = await getEntry('resume', locale)
	if (!entry)
		throw new Error(`Missing content/resume/${locale}.yaml`)

	const { contact, education, experience, openSource, projects, role, skills, summary } = entry.data
	const formatPeriod = (start: string, end?: string) => (start === end ? start : `${start} – ${end ?? m.resume.present}`)

	const lines: string[] = [
		`# ${SITE_NAME} — ${m.resume.title}`,
		'',
		`**${role}**`,
		'',
		summary,
		'',
		contact.map(item => `[${item.label}](${item.href})`).join(' · '),
		'',
		`## ${m.resume.sections.experience}`,
		'',
	]

	for (const org of experience) {
		lines.push(`### ${org.organization} — ${org.role} (${formatPeriod(org.start, org.end)})`, '')
		if (org.summary)
			lines.push(org.summary, '')
		for (const project of org.projects) {
			lines.push(`#### ${project.name} (${formatPeriod(project.start, project.end)})`, '')
			if (project.summary)
				lines.push(project.summary, '')
			for (const highlight of project.highlights)
				lines.push(`- ${highlight}`)
			if (project.stack.length > 0)
				lines.push(`- Stack: ${project.stack.join(', ')}`)
			lines.push('')
		}
	}

	lines.push(`## ${m.resume.sections.openSource}`, '')
	for (const item of openSource)
		lines.push(`- [${item.project}](${item.href}) (${item.date}) — ${item.summary}`)

	lines.push('', `## ${m.resume.sections.projects}`, '')
	for (const project of projects)
		lines.push(`- [${project.name}](${project.href}) (${project.date}) — ${project.summary}`)

	lines.push('', `## ${m.resume.sections.skills}`, '')
	for (const group of skills)
		lines.push(`- **${group.group}**: ${group.items.join(', ')}`)

	lines.push('', `## ${m.resume.sections.education}`, '')
	for (const item of education) {
		const parts = [item.degree, item.major, item.school].filter(Boolean)
		lines.push(`- ${parts.join(' · ')}`)
	}

	return lines.join('\n')
}

export async function renderLlmsTxt(locale: Locale): Promise<string> {
	const m = getMessages(locale)
	const posts = await getAllPosts(locale)

	const lines: string[] = [
		`# ${SITE_NAME}`,
		'',
		`> ${m.home.metaDescription}`,
		'',
		`${SITE_NAME} is a Design Engineer building frontend interfaces and AI-native products. This site serves English, Chinese, and Japanese copy on shared URLs (controlled via \`Accept-Language\` or the \`imi_locale\` cookie) and supports \`Accept: text/markdown\` content negotiation on \`/\`, \`/post\`, \`/post/{slug}\`, and \`/resume\`.`,
		'',
		'## Core Pages',
		'',
		`- [Home](${SITE_URL}): Profile, bio, recent writing, and selected projects`,
		`- [Résumé](${absoluteUrl('/resume.md')}): Experience, open source, side projects, skills, and education`,
		`- [Writing Archive](${absoluteUrl('/post.md')}): All published posts grouped by year`,
		`- [Design System](${absoluteUrl('/design')}): Live typography, OKLCH color tokens, trilingual wrapping, and motion spec`,
		'',
		'## Writing',
		'',
		...posts.map(post => `- [${post.title}](${absoluteUrl(`/post/${post.slug}.md`)}): ${post.summary}`),
		'',
		'## Feeds & Source',
		'',
		`- [RSS (Chinese)](${RSS_FEED_URL})`,
		`- [RSS (English)](${RSS_FEED_URL_EN})`,
		`- [RSS (Japanese)](${RSS_FEED_URL_JA})`,
		`- [Source Repository](${REPO_URL})`,
	]

	return lines.join('\n')
}

export async function renderMarkdownForPath(pathname: string, locale: Locale): Promise<null | string> {
	if (pathname === '/')
		return renderHomeMarkdown(locale)
	if (pathname === '/post')
		return renderPostListMarkdown(locale)
	if (pathname === '/resume')
		return renderResumeMarkdown(locale)

	const match = pathname.match(NEGOTIABLE_POST_PATH_RE)
	if (match?.[1]) {
		try {
			return renderPostMarkdown(decodeURIComponent(match[1]), locale)
		}
		catch {
			return null
		}
	}

	return null
}
