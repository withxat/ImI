import type { Locale } from '@/lib/i18n/constants'

import { getMessages } from '@/lib/i18n/messages'

export type OgStaticPage = 'design' | 'notFound' | 'post' | 'resume'

/** Localized OG copy for non-post routes (sourced directly from site messages). */
export function ogStaticPagesFor(locale: Locale) {
	const m = getMessages(locale)
	return {
		design: {
			header: m.design.eyebrow,
			summary: m.design.pageDescription,
			title: 'ImI Design System',
		},
		notFound: {
			header: '404',
			summary: m.home.notFound.description,
			title: m.home.notFound.title,
		},
		post: {
			header: m.header.writing,
			summary: m.blog.pageDescription,
			title: m.blog.title,
		},
		resume: {
			header: m.resume.title,
			summary: m.resume.pageDescription,
			title: 'Xat',
		},
	} as const satisfies Record<OgStaticPage, { header: string, summary: string, title: string }>
}

/** Localized default / home OG copy. */
export function ogSiteDefaultFor(locale: Locale) {
	const m = getMessages(locale)
	return {
		eyebrow: m.home.role,
		summary: m.home.bioLead,
	} as const
}

/** Filename under `public/og/{locale}/pages/` (notFound → `404.png`). */
export const OG_STATIC_PAGE_FILES: Record<OgStaticPage, string> = {
	design: 'design',
	notFound: '404',
	post: 'post',
	resume: 'resume',
}
