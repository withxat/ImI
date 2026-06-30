/** Open Graph image dimensions (Facebook / Twitter standard). */
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

/** Satori-friendly approximations of `:root` / light tokens (globals.css, DESIGN.md). */
export const OG_COLORS = {
	/** --highlight-text */
	accent: '#c4616f',
	/** --background */
	bg: '#ffffff',
	/** --border */
	border: 'rgba(0, 0, 0, 0.08)',
	/** --muted-foreground */
	muted: '#71717a',
	/** --muted wash */
	pillBg: 'rgba(0, 0, 0, 0.04)',
	/** --foreground */
	primary: '#2a2a2e',
} as const

export const OG_FONT_FAMILY = {
	/** Chinese fallback when display lacks glyphs (local static TTF). */
	cjk: 'MiSans',
	/** Latin / UI (fontsource static woff). */
	display: 'Hanken Grotesk',
	/** Fugaz One — literal "Xat" wordmark only (see DESIGN.md). */
	wordmark: 'Fugaz One',
} as const

/** Matches site stack: Hanken first, MiSans for CJK. */
export const OG_BODY_FONT_STACK = `${OG_FONT_FAMILY.display}, ${OG_FONT_FAMILY.cjk}`

/** Shared OG typography scale (Satori px). */
export const OG_TYPE = {
	avatar: 76,
	body: 36,
	eyebrow: 36,
	headline: 72,
	meta: 30,
	pill: 28,
	wordmark: 54,
} as const

export const ZH_CATEGORY_NAMES: Record<string, string> = {
	design: '设计',
	life: '生活',
	tech: '技术',
}

export const OG_SITE_DEFAULT = {
	eyebrow: '设计工程师',
	summary: '爱打磨界面，也喜欢探索 AI 的可能性。',
	title: 'Xat',
} as const
