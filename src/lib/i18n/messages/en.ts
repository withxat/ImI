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
			afterLink: ' if you prefer reading the original.',
			beforeLink: 'Translated by AI from the Chinese original. Switch to ',
			switchToChineseAriaLabel: 'Switch site language to Chinese for the original article',
		},
		readingTime: (minutes: number) => `${minutes} min read`,
		sectionCount: (count: number) => `${count} sections`,
		title: 'All writing',
		toc: 'Contents',
		viewSource: 'View source',
	},
	capabilities: [
		{
			items: [],
			title: 'AI experience',
		},
		{
			items: [
				{
					description: 'TypeScript monorepo starter template',
					title: 'Monorepo-Template',
				},
			],
			title: 'Frontend engineering',
		},
		{
			items: [
				{
					description: 'My strict TypeScript config preset',
					title: 'TSConfig',
				},
				{
					description: 'Xat\'s own slightly obsessive ESLint config',
					title: 'ESLint-Config',
				},
			],
			title: 'Developer toolchain',
		},
		{
			items: [
				{
					description: 'Renders Unicode as Fluent Emoji while copying back as Unicode',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: 'A minimal Astro blog template extracted from this site',
					title: 'Mikan',
				},
				{
					description: 'A SwiftUI Cloudflare client for iPhone, with widgets and Live Activities',
					title: 'Dash',
				},
				{
					description: 'My personal website',
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
		pageDescription: 'The design system for xat.sh: typography, color tokens, trilingual wrapping, shape, and motion, all read live from CSS.',
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
		copyEmail: 'Copy email address',
		emailCopied: 'Copied!',
		moeIcp: 'Moe ICP Filing No. 20264698',
		stats: {
			afterOnline: 'here right now',
			afterTotal: 'times',
			alone: 'Just you here right now',
			beforeOnline: '',
			beforeTotal: 'Visited',
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
		bioLead: 'I like sweating the UI details and building AI tools that actually feel good to use.',
		introAfterProducts: '.',
		introBeforeSystems: 'My ',
		introBetweenBadges: ' shapes how I think about structure; these days I mostly build frontend and ',
		metaDescription:
			'Xat, a Design Engineer working on frontend and AI products, writing about code, interfaces, and everyday tools.',
		notFound: {
			description: 'The link may have moved or had a typo. Here\'s some recent writing instead.',
			didYouMean: {
				after: '”?',
				before: 'Maybe you meant “',
			},
			title: 'Nothing at this address',
		},
		playName: 'Play name pronunciation',
		poke: {
			label: 'Poke Xat',
			lines: ['Hey!', 'Yeah?', 'Easy there', 'Okay, okay'],
			sulk: 'Alright, I\'m ignoring you now.',
		},
		projectsEyebrow: 'Projects',
		role: 'Design Engineer',
		spotlight: {
			description: 'The site you\'re reading. Built with Astro 7 on Cloudflare Workers, with prefix-free trilingual copy, hand-matched CJK weights, subset fonts, and a live spec at /design.',
			source: 'Source on GitHub',
			title: 'This site & its design system',
		},
		tagline: 'Xat - Design Engineer',
		title: 'Xat - Design Engineer',
		toolsShelfLabel: 'Configs & templates',
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
