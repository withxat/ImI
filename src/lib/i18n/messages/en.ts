import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const en: Messages = {
	blog: {
		archiveSubtitle: 'The archive, where some words take their time to glow.',
		goHome: 'Go to home',
		pageDescription: 'Notes on frontend, design, AI, and assorted bits from Xat.',
		pageTitle: 'Xat\'s Archive',
		postTranslatedNotice: {
			afterLink: ' to read the author-written source text.',
			beforeLink: 'This article is an AI translation from the Chinese original. Switch the site language to ',
			switchToChineseAriaLabel: 'Switch site language to Chinese for the original article',
		},
		title: 'All writings',
	},
	capabilities: [
		{
			emptyState: {
				description: 'Only work I\'m actually happy with makes it here.',
				title: 'No case studies yet',
			},
			items: [],
			summary: 'Make AI useful, and make people actually want to use it.',
			title: 'AI experience',
		},
		{
			items: [
				{
					description: '🍤 TypeScript monorepo template',
					title: 'Monorepo-Template',
				},
			],
			summary: 'Get the architecture, performance, and long-term maintenance right.',
			title: 'Frontend engineering',
		},
		{
			items: [
				{
					description: '📒 A strict TypeScript configuration for modern project',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat\'s own slightly obsessive ESLint config',
					title: 'ESLint-Config',
				},
			],
			summary: 'Tinkering with config and workflows so the same thing only trips us once.',
			title: 'Developer toolchain',
		},
		{
			items: [
				{
					description: '😀 A Rehype plugin that renders Unicode Emoji as Fluent Emoji',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: '🍊 A warm, minimal Astro blog template',
					title: 'Mikan',
				},
				{
					description: '🫧 My personal website and digital garden',
					title: 'ImI',
				},
			],
			summary: 'Tuning motion and interaction details until an interface feels smoother and looks better.',
			title: 'Interface & interaction',
		},
	],
	categories: {
		design: {
			description: 'Aesthetic obsessions, indulged',
			name: 'Design',
		},
		life: {
			description: 'Bubbles from everyday life',
			name: 'Life',
		},
		tech: {
			description: 'Notes from development',
			name: 'Tech',
		},
	},
	codeBlock: codeBlockByLocale.en,
	design: {
		colors: {
			groups: {
				code: 'Code',
				content: 'Text',
				highlight: 'Accent',
				status: 'Status',
				surface: 'Surfaces',
				washEdges: 'Fills & borders',
			},
			modeLabel: {
				dark: 'Dark',
				light: 'Light',
			},
			roles: {
				background: 'Page',
				border: '1px hairline',
				code: 'Vesper canvas',
				codeForeground: 'Code text',
				foreground: 'Primary text · primary',
				highlightIcon: 'Icon tint',
				highlightSoft: 'Underline · halo',
				highlightText: 'Wordmark · links',
				muted: 'Hover · inline code · accent',
				mutedForeground: 'Secondary text',
				selection: 'Text selection',
				status: 'Reserved',
				surface: 'Card · popover',
			},
			title: 'Colors',
		},
		eyebrow: 'Design System',
		flipMascot: 'Flip the coin',
		geometry: {
			haloLabel: 'Badges · translation note',
			imageEdgeLabel: 'Article images',
			radiiTitle: 'Radii',
			shadowsTitle: 'Shadows',
			title: 'Shape & shadow',
		},
		motion: {
			replay: 'Replay',
			slow: '0.25×',
			title: 'Motion',
		},
		pageDescription: 'The design system behind xat.sh: typography, color tokens, trilingual line breaking, layers, and motion.',
		pageTitle: 'Design System - Xat',
		typography: {
			families: {
				callingCode: 'Code & mono',
				fugazOne: '“Xat” only',
				hankenGrotesk: 'Latin',
				miSans: 'CJK · wght 330/415/500 to match Hanken',
				sourceHanSerif: 'Home lead',
			},
			scale: {
				bioLead: 'Bio lead',
				body: 'Body',
				display: 'Display',
				headline: 'Headline',
				label: 'Label',
				mono: 'Mono',
				title: 'Title',
				wordmark: 'Wordmark',
			},
			scaleTitle: 'Type scale',
			title: 'Typography',
		},
		wrapping: {
			rulesOff: ':lang() rules: off',
			rulesOn: ':lang() rules: on',
			title: 'Trilingual wrap',
			widthLabel: 'Column width',
		},
	},
	footer: {
		connect: 'Here\'s where you can catch me:',
		moeIcp: 'Moe ICP Filing No. 20264698',
		stats: {
			afterOnline: ' wandering by',
			afterTotal: ' times',
			beforeOnline: 'Right now, ',
			beforeTotal: 'Spotted ',
		},
	},
	header: {
		goHome: 'Go to home',
		theme: {
			ariaLabel: 'Theme',
			dark: 'Dark',
			light: 'Light',
			system: 'System',
		},
	},
	home: {
		bioLead: 'I love polishing interfaces and exploring what AI can do.',
		bioP1: 'I want to bring design and technology together to solve real problems.',
		capabilitiesEyebrow: 'Capabilities',
		capabilitiesIntro: 'The tiny but important details between product, design, and engineering always pull me in.',
		emptyCapabilityDescription: 'When it\'s ready, it\'ll show up here.',
		emptyCapabilityTitle: 'Work in progress',
		introAfterProducts: '.',
		introBeforeSystems: 'A ',
		introBetweenBadges: ' taught me to balance design, engineering, and real needs while building ',
		metaDescription:
			'Design Engineer focused on AI and frontend, writing about code, design, and AI.',
		notFound: {
			description: 'Looks like there\'s nothing here. The page may have moved.',
			goHome: 'Back to home',
			title: 'Page not found',
		},
		role: 'Design Engineer',
		tagline: 'Xat - Design Engineer',
		title: 'Xat - Design Engineer',
		viewAllPosts: 'View all',
		writingEyebrow: 'Writing',
	},
	localeSwitcher: {
		ariaLabel: 'Language',
	},
	wanderer: {
		wanderer: 'wanderer',
		withCountry: {
			bridge: 'from',
			closing: '.',
			lead: 'Hi, ',
			pattern: 'en',
		},
		withoutCountry: {
			after: '. Glad you found your way here.',
			before: 'Hi, ',
		},
	},
}

export default en
