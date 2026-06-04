import {
	OG_BODY_FONT_STACK,
	OG_COLORS,
	OG_FONT_FAMILY,
	OG_HEIGHT,
	OG_SITE_DEFAULT,
	OG_WIDTH,
	ZH_CATEGORY_NAMES,
} from '@/lib/og/constants'
import { truncate } from '@/lib/og/truncate'

export interface PostOgInput {
	avatarSrc: string
	category: string
	dateLabel: string
	summary: string
	title: string
}

export interface SiteOgInput {
	avatarSrc: string
	eyebrow: string
	summary: string
}

const BRAND_AVATAR_SIZE = 68
const BRAND_WORDMARK_SIZE = 48
/** Nudge main column above vertical center (room for bottom brand). */
const CONTENT_TOP_PADDING = 12

const shellStyle = {
	backgroundColor: OG_COLORS.bg,
	color: OG_COLORS.primary,
	display: 'flex',
	flexDirection: 'column',
	fontFamily: OG_BODY_FONT_STACK,
	height: '100%',
	padding: '72px 80px',
	width: '100%',
} as const

function dateHeader(dateLabel: string) {
	return {
		props: {
			children: dateLabel,
			style: {
				color: OG_COLORS.muted,
				fontSize: 22,
				fontWeight: 500,
				width: '100%',
			},
		},
		type: 'div',
	}
}

function brandCorner(avatarSrc: string) {
	return {
		props: {
			children: [
				{
					props: {
						height: BRAND_AVATAR_SIZE,
						src: avatarSrc,
						style: {
							border: `1px solid ${OG_COLORS.border}`,
							borderRadius: 999,
						},
						width: BRAND_AVATAR_SIZE,
					},
					type: 'img',
				},
				{
					props: {
						children: OG_SITE_DEFAULT.title,
						style: {
							color: OG_COLORS.accent,
							fontFamily: OG_FONT_FAMILY.wordmark,
							fontSize: BRAND_WORDMARK_SIZE,
							fontWeight: 400,
							letterSpacing: 0,
							lineHeight: 1,
						},
					},
					type: 'div',
				},
			],
			style: {
				alignItems: 'center',
				display: 'flex',
				gap: 18,
				justifyContent: 'flex-end',
				marginTop: 'auto',
				width: '100%',
			},
		},
		type: 'div',
	}
}

function categoryPill(label: string) {
	return {
		props: {
			children: label,
			style: {
				alignSelf: 'flex-start',
				backgroundColor: OG_COLORS.pillBg,
				border: `1px solid ${OG_COLORS.border}`,
				borderRadius: 999,
				color: OG_COLORS.muted,
				fontSize: 20,
				fontWeight: 500,
				marginTop: 20,
				padding: '8px 18px',
			},
		},
		type: 'div',
	}
}

export function siteOgTemplate(input: SiteOgInput) {
	return {
		props: {
			children: [
				{
					props: {
						children: [
							{
								props: {
									children: input.eyebrow,
									style: {
										color: OG_COLORS.accent,
										fontSize: 28,
										fontWeight: 500,
									},
								},
								type: 'div',
							},
							{
								props: {
									children: truncate(input.summary, 56),
									style: {
										display: 'flex',
										flexDirection: 'column',
										fontSize: 52,
										fontWeight: 600,
										letterSpacing: '-0.02em',
										lineHeight: 1.2,
										marginTop: 24,
										maxWidth: 920,
									},
								},
								type: 'div',
							},
						],
						style: {
							display: 'flex',
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'flex-start',
							paddingTop: CONTENT_TOP_PADDING,
						},
					},
					type: 'div',
				},
				brandCorner(input.avatarSrc),
			],
			style: shellStyle,
		},
		type: 'div',
	}
}

export function postOgTemplate(input: PostOgInput) {
	const categoryLabel = ZH_CATEGORY_NAMES[input.category] ?? input.category

	return {
		props: {
			children: [
				dateHeader(input.dateLabel),
				{
					props: {
						children: [
							categoryPill(categoryLabel),
							{
								props: {
									children: [
										{
											props: {
												children: truncate(input.title, 72),
												style: {
													display: 'flex',
													fontSize: 56,
													fontWeight: 600,
													letterSpacing: '-0.02em',
													lineHeight: 1.15,
													marginTop: 28,
													maxWidth: 1000,
												},
											},
											type: 'div',
										},
										{
											props: {
												children: truncate(input.summary, 96),
												style: {
													color: OG_COLORS.muted,
													display: 'flex',
													fontSize: 28,
													fontWeight: 400,
													lineHeight: 1.45,
													marginTop: 20,
													maxWidth: 960,
												},
											},
											type: 'div',
										},
									],
									style: {
										display: 'flex',
										flex: 1,
										flexDirection: 'column',
										justifyContent: 'flex-start',
									},
								},
								type: 'div',
							},
						],
						style: {
							display: 'flex',
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'flex-start',
							paddingTop: CONTENT_TOP_PADDING,
						},
					},
					type: 'div',
				},
				brandCorner(input.avatarSrc),
			],
			style: shellStyle,
		},
		type: 'div',
	}
}

export const ogRenderSize = { height: OG_HEIGHT, width: OG_WIDTH }
