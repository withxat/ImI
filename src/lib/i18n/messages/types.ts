import type { CodeBlockCopy } from '@/lib/i18n/code-block-copy.ts'

export interface CategoryCopy {
	description: string
	name: string
}

export interface CapabilityItemCopy {
	description: string
	title: string
}

export interface CapabilityCopy {
	emptyState?: { description: string, title: string }
	items: CapabilityItemCopy[]
	summary: string
	title: string
}

export interface FooterWandererWithCountry {
	bridge: string
	closing: string
	lead: string
	pattern: 'eastAsia' | 'en'
}

export interface FooterWandererCopy {
	wanderer: string
	withCountry: FooterWandererWithCountry
	withoutCountry: {
		after: string
		before: string
	}
}

/** Copy for the AI-translation banner; `中文` is inserted as a locale-switch control between the two strings. */
export interface PostTranslatedNoticeCopy {
	afterLink: string
	beforeLink: string
	switchToChineseAriaLabel: string
}

export type { CodeBlockCopy }

export type ColorRoleKey
	= | 'accent'
		| 'background'
		| 'border'
		| 'card'
		| 'destructive'
		| 'foreground'
		| 'highlightIcon'
		| 'highlightSoft'
		| 'highlightText'
		| 'info'
		| 'muted'
		| 'mutedForeground'
		| 'popover'
		| 'primary'
		| 'success'
		| 'surface'
		| 'warning'

export type ColorGroupKey = 'content' | 'highlight' | 'status' | 'surface' | 'washEdges'

export interface ColorGroupCopy {
	description: string
	title: string
}

export type TypographyScaleRoleKey
	= | 'bioLead'
		| 'body'
		| 'display'
		| 'headline'
		| 'label'
		| 'mono'
		| 'title'
		| 'wordmark'

export interface DesignSystemCopy {
	colors: {
		groups: Record<ColorGroupKey, ColorGroupCopy>
		intro: string
		modeLabel: {
			dark: string
			light: string
		}
		roles: Record<ColorRoleKey, string>
		tablistLabel: string
		title: string
	}
	components: {
		cardDescription: string
		cardTitle: string
		intro: string
		particlesIntro: string
		particlesTitle: string
		primeIntro: string
		primeTitle: string
		textLinkDescriptor: string
		title: string
		wandererDescriptor: string
	}
	elevation: {
		flatNote: string
		intro: string
		title: string
	}
	eyebrow: string
	flipMascot: string
	northStar: {
		characteristics: string[]
		tagline: string
		title: string
	}
	pageDescription: string
	pageTitle: string
	principles: {
		rules: Array<{ body: string, name: string }>
		title: string
	}
	typography: {
		sampleDescriptors: {
			accent: string
			cjk: string
			display: string
			mono: string
			serif: string
		}
		scale: Record<TypographyScaleRoleKey, { role: string, spec: string }>
		scaleTitle: string
		specimensTitle: string
		title: string
	}
}

export interface Messages {
	blog: {
		archiveSubtitle: string
		goHome: string
		pageDescription: string
		pageTitle: string
		/** Shown above translated article bodies when UI locale is not Chinese. */
		postTranslatedNotice?: PostTranslatedNoticeCopy
		title: string
	}
	capabilities: CapabilityCopy[]
	categories: Record<'design' | 'life' | 'tech', CategoryCopy>
	codeBlock: CodeBlockCopy
	design: DesignSystemCopy
	footer: {
		connect: string
		moeIcp: string
		stats: {
			afterOnline: string
			afterTotal: string
			beforeOnline: string
			beforeTotal: string
			middle: string
		}
	}
	header: {
		goHome: string
		theme: {
			ariaLabel: string
			dark: string
			light: string
			system: string
		}
	}
	home: {
		bioLead: string

		bioP1: string
		capabilitiesEyebrow: string
		capabilitiesIntro: string
		emptyCapabilityDescription: string
		emptyCapabilityTitle: string
		introAfterProducts: string
		introBeforeSystems: string
		introBetweenBadges: string
		/** `<meta name="description">` and default JSON-LD site blurbs for the home page. */
		metaDescription: string
		notFound: {
			description: string
			goHome: string
			title: string
		}
		role: string
		tagline: string
		title: string
		viewAllPosts: string
		writingEyebrow: string
	}
	localeSwitcher: {
		ariaLabel: string
	}
	wanderer: FooterWandererCopy
}
