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
	footer: {
		connect: string
		moeIcp: string
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
