import type { CodeBlockCopy } from '@/lib/i18n/code-block-copy.ts'

export interface CodingPulseCopy {
	activeDaysSuffix: string
	axisToday: string
	badgeHigh: string
	badgePeak: string
	badgeRest: string
	badgeToday: string
	charging: string
	eyebrow: string
	months: readonly [string, string, string, string, string, string, string, string, string, string, string, string]
	moodActive: string
	moodIdle: string
	other: string
	overviewLabel: string
	restHeadline: string
	restSubAfter: string
	restSubBefore: string
	roundsSuffix: string
	rulerAriaLabel: string
	scopeAll: string
	scopeAriaLabel: string
	scopeToday: string
	weekdays: readonly [string, string, string, string, string, string, string]
}

export interface CategoryCopy {
	name: string
}

export interface CapabilityItemCopy {
	description: string
	title: string
}

export interface CapabilityCopy {
	items: CapabilityItemCopy[]
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
	= | 'background'
		| 'border'
		| 'code'
		| 'codeForeground'
		| 'foreground'
		| 'highlightBrand'
		| 'highlightIcon'
		| 'highlightSoft'
		| 'highlightText'
		| 'muted'
		| 'mutedForeground'
		| 'selection'
		| 'status'
		| 'surface'

export type ColorGroupKey = 'code' | 'content' | 'highlight' | 'status' | 'surface' | 'washEdges'

export type TypefaceKey = 'callingCode' | 'fugazOne' | 'hankenGrotesk' | 'miSans' | 'sourceHanSerif'

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
		copied: string
		copyToken: (name: string) => string
		copyValue: (name: string, mode: string) => string
		groups: Record<ColorGroupKey, string>
		modeLabel: {
			dark: string
			light: string
		}
		roles: Record<ColorRoleKey, string>
		title: string
	}
	eyebrow: string
	flipMascot: string
	geometry: {
		haloLabel: string
		imageEdgeLabel: string
		radiiTitle: string
		shadowsTitle: string
		title: string
	}
	motion: {
		replay: string
		slow: string
		title: string
	}
	pageDescription: string
	pageTitle: string
	typography: {
		families: Record<TypefaceKey, string>
		scale: Record<TypographyScaleRoleKey, string>
		scaleTitle: string
		title: string
		weightsMatchOff: string
		weightsMatchOn: string
		weightsNote: string
		weightsTitle: string
	}
	wrapping: {
		rulesOff: string
		rulesOn: string
		title: string
		widthLabel: string
	}
}

export interface Messages {
	blog: {
		goHome: string
		lightbox: {
			close: string
			next: string
			prev: string
			zoom: string
		}
		linkCopied: string
		moreWriting: string
		newer: string
		older: string
		pageDescription: string
		pageTitle: string
		postCountSuffix: string
		/** Shown above translated article bodies when UI locale is not Chinese. */
		postTranslatedNotice?: PostTranslatedNoticeCopy
		/** Estimated reading time beside the post date. */
		readingTime: (minutes: number) => string
		/** Opens the section outline: the scrollbar markers with their titles. */
		sectionCount: (count: number) => string
		title: string
		/** Label of the section list; also the outline's landmark name. */
		toc: string
		/** Links to the post's MDX file on GitHub. */
		viewSource: string
	}
	capabilities: CapabilityCopy[]
	categories: Record<'design' | 'life' | 'tech', CategoryCopy>
	codeBlock: CodeBlockCopy
	design: DesignSystemCopy
	footer: {
		/** The copy button that grows after the footer's Email link on hover or focus. */
		copyEmail: string
		/** Shown over that button once the address is copied. */
		emailCopied: string
		linksAriaLabel: string
		moeIcp: string
		stats: {
			afterOnline: string
			afterTotal: string
			/** Replaces the online count when the reader is the only one here. */
			alone: string
			beforeOnline: string
			beforeTotal: string
		}
	}
	header: {
		breadcrumbAriaLabel: string
		goHome: string
		home: string
		skipToContent: string
		theme: {
			ariaLabel: string
			dark: string
			light: string
			system: string
		}
		writing: string
	}
	home: {
		bioLead: string
		codingPulse: CodingPulseCopy
		introAfterProducts: string
		introBeforeSystems: string
		introBetweenBadges: string
		/** `<meta name="description">` and default JSON-LD site blurbs for the home page. */
		metaDescription: string
		notFound: {
			description: string
			/** Around a link to the post whose slug is closest to the missing path. */
			didYouMean: {
				after: string
				before: string
			}
			title: string
		}
		playName: string
		/** The home avatar answers a poke with `lines` in turn; poked past them, it sulks for a moment. */
		poke: {
			label: string
			lines: string[]
			sulk: string
		}
		projectsEyebrow: string
		role: string
		/** Featured card for ImI (this site + its living design spec). */
		spotlight: {
			description: string
			source: string
			title: string
		}
		tagline: string
		title: string
		/** Label for the compact bottom shelf of config presets and templates. */
		toolsShelfLabel: string
		viewAllPosts: string
		writingEyebrow: string
	}
	localeSwitcher: {
		ariaLabel: string
	}
	/** Chrome around `content/resume/{locale}.yaml`; the resume text itself lives there. */
	resume: {
		pageDescription: string
		pageTitle: string
		/** End label of a current role. */
		present: string
		print: string
		sections: {
			education: string
			experience: string
			openSource: string
			projects: string
			skills: string
		}
		/** Footer link label. */
		title: string
	}
	wanderer: FooterWandererCopy
}
