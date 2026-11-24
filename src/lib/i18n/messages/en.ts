import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const en: Messages = {
	blog: {
		goHome: 'Go to home',
		moreWriting: 'More writing',
		newer: 'Newer',
		older: 'Older',
		pageDescription: 'Notes on frontend, design, AI, and assorted bits from Xat.',
		pageTitle: 'Xat\'s Archive',
		postCountSuffix: ' posts',
		postTranslatedNotice: {
			afterLink: ' to read the author-written source text.',
			beforeLink: 'This article is an AI translation from the Chinese original. Switch the site language to ',
			switchToChineseAriaLabel: 'Switch site language to Chinese for the original article',
		},
		title: 'All writing',
		toc: 'Contents',
	},
	capabilities: [
		{
			items: [],
			title: 'AI experience',
		},
		{
			items: [
				{
					description: '🍤 TypeScript monorepo template',
					title: 'Monorepo-Template',
				},
			],
			title: 'Frontend engineering',
		},
		{
			items: [
				{
					description: '📒 A strict TypeScript configuration for modern projects',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat\'s own slightly obsessive ESLint config',
					title: 'ESLint-Config',
				},
			],
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
			title: 'Interface & interaction',
		},
	],
	categories: {
		design: {
			name: 'Design',
		},
		life: {
			name: 'Life',
		},
		tech: {
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
				highlightBrand: 'Wordmark · wanderer',
				highlightIcon: 'Icon tint',
				highlightSoft: 'Underline · halo',
				highlightText: 'Links · emphasis',
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
				miSans: 'CJK',
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
			weightsMatchOff: 'Matching: off',
			weightsMatchOn: 'Matching: on',
			weightsNote: 'At the same font-weight, MiSans strokes come out thicker than Hanken’s, so I matched each MiSans wght to Hanken by hand. Turn matching off and the scale tips.',
			weightsTitle: 'Weights',
		},
		wrapping: {
			rulesOff: ':lang() rules: off',
			rulesOn: ':lang() rules: on',
			title: 'Trilingual wrap',
			widthLabel: 'Column width',
		},
	},
	footer: {
		moeIcp: 'Moe ICP Filing No. 20264698',
		stats: {
			afterOnline: ' wandering by',
			afterTotal: ' times',
			alone: 'Right now, it\'s just you wandering by',
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
		designProject: '📐 The spec for this site, every value read from the live CSS',
		introAfterProducts: '.',
		introBeforeSystems: 'A ',
		introBetweenBadges: ' taught me to balance design, engineering, and real needs while building ',
		metaDescription:
			'Design Engineer focused on AI and frontend, writing about code, design, and AI.',
		notFound: {
			description: 'Maybe it moved, maybe it was never here. Here\'s some recent writing instead.',
			title: 'This page wandered off',
		},
		playName: 'Play name pronunciation',
		projectsEyebrow: 'Projects',
		role: 'Design Engineer',
		tagline: 'Xat - Design Engineer',
		title: 'Xat - Design Engineer',
		viewAllPosts: 'View all',
		writingEyebrow: 'Writing',
	},
	localeSwitcher: {
		ariaLabel: 'Language',
	},
	resume: {
		pageDescription: 'Résumé of Xat, a design engineer working on AI-native products, frontend engineering, and interface craft.',
		pageTitle: 'Résumé - Xat',
		present: 'Present',
		print: 'Print or save as PDF',
		sections: {
			education: 'Education',
			experience: 'Experience',
			openSource: 'Open source',
			projects: 'Side projects',
			skills: 'Skills',
		},
		title: 'Résumé',
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
