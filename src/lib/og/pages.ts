import zh from '@/lib/i18n/messages/zh'

/** Chinese OG copy for non-post routes (aligned with `zh` messages). */
export const OG_STATIC_PAGES = {
	design: {
		header: '设计系统',
		summary: zh.design.pageDescription,
		title: 'ImI Design System',
	},
	notFound: {
		header: '404',
		summary: zh.home.notFound.description,
		title: zh.home.notFound.title,
	},
	post: {
		header: '写作',
		summary: zh.blog.pageDescription,
		title: zh.blog.title,
	},
} as const

export type OgStaticPage = keyof typeof OG_STATIC_PAGES

/** Filename under `public/og/pages/` (notFound → `404.png`). */
export const OG_STATIC_PAGE_FILES: Record<OgStaticPage, string> = {
	design: 'design',
	notFound: '404',
	post: 'post',
}
