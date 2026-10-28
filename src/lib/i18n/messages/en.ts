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
				{
					description: '🍊 A warm, minimal Astro blog template',
					title: 'Mikan',
				},
				{
					description: '🫧 My personal website and digital garden',
					title: 'ImI',
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
				content: {
					description: 'Base colors for text and icons.',
					title: 'Content',
				},
				highlight: {
					description: 'Brand color. Used sparingly, only where emphasis belongs.',
					title: 'Highlight',
				},
				status: {
					description: 'Semantic feedback. Intent first, decoration second.',
					title: 'Status',
				},
				surface: {
					description: 'The page, panels, and floating layers.',
					title: 'Surface',
				},
				washEdges: {
					description: 'Soft interactive fills and quiet edges for bounded surfaces.',
					title: 'Wash & edges',
				},
			},
			intro: 'Both palettes show side by side on wide screens; tap to swap on narrow ones. Defaults to your current theme.',
			modeLabel: {
				dark: 'Dark',
				light: 'Light',
			},
			roles: {
				accent: 'Soft interactive fill',
				background: 'Page background',
				border: 'Border',
				card: 'Card fill',
				destructive: 'Error, destructive action',
				foreground: 'Primary text',
				highlightIcon: 'Brand icon color',
				highlightSoft: 'Soft brand fill',
				highlightText: 'Brand highlight text',
				info: 'Information',
				muted: 'Soft fill',
				mutedForeground: 'Secondary text',
				popover: 'Floating layer',
				primary: 'Primary action fill',
				success: 'Success, confirmation',
				surface: 'Surface',
				warning: 'Warning',
			},
			tablistLabel: 'Palette mode',
			title: 'Colors',
		},
		components: {
			cardDescription: 'An Astro-native component library.',
			cardTitle: 'bejamas/ui',
			intro: 'Two layers: one keeps the primitives untouched; the other composes them into components that belong to this site.',
			particlesIntro: 'Small pieces that fit the site\'s character.',
			particlesTitle: 'Particles',
			primeIntro: 'Buttons, badges, popovers, dialogs, all from bejamas/ui.',
			primeTitle: 'Prime',
			statDigitsDescriptor: 'Metallic odometer digits for live visit stats in the footer',
			textLinkDescriptor: 'Pill underline with rounded end caps',
			title: 'Components',
			wandererDescriptor: 'Animated gradient text, used only as decoration in the footer',
		},
		elevation: {
			flatNote: 'Surfaces sit flat against the page. Hairlines mark their edges; soft glows signal interaction.',
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: 'Signature soft edge for interactive surfaces',
			imageEdgeDescription: '1px ink edge · shadow-halo',
			imageEdgeLabel: 'Article media edge',
			intro: 'Light shadows tinted with highlight-soft. They signal interactivity.',
			title: 'Elevation',
		},
		eyebrow: 'Design System',
		flipMascot: 'Flip mascot',
		northStar: {
			characteristics: [
				'Mono-ink palette + one accent (Quiet Rose / Warm Apricot)',
				'Spacing, rhythm, and typographic alignment organize the page',
				'Trilingual typography, tuned for zh / en / ja',
				'Reveal animation on entry, 420ms ease-out-quart',
				'Responsive, narrow single column (42rem max)',
			],
			tagline: 'A precise frame with a soft surface. Accent color appears only when it has a job to do.',
			title: 'Cute, shiny, and elegant',
		},
		pageDescription: 'The design system behind xat.sh: typography, color tokens, layers, components, and the principles that keep it coherent.',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text and highlight-soft take up no more than 10% of a screen.',
					name: 'One Voice Principle',
				},
				{
					body: 'Spacing, rhythm, and typographic alignment organize the page; hairlines only bound surfaces.',
					name: 'Spacing-first Layout Principle',
				},
				{
					body: 'font-fugaz-one is used only for the "Xat" logo text.',
					name: 'One Wordmark Principle',
				},
				{
					body: 'The background-clip: text gradient appears only in the footer wanderer line.',
					name: 'One Gradient Principle',
				},
				{
					body: 'Code blocks stay Vesper-dark in both light and dark site modes.',
					name: 'Code Stays Dark Principle',
				},
			],
			title: 'Design principles',
		},
		typography: {
			sampleDescriptors: {
				accent: 'Accent',
				cjk: 'CJK',
				display: 'Display & UI',
				mono: 'Monospace',
				serif: 'Serif',
			},
			scale: {
				bioLead: { role: 'Bio lead', spec: 'Source Han Serif SC · 16px / 28px · 600' },
				body: { role: 'Body', spec: 'Hanken Grotesk + MiSans · 16px / 28px · 400' },
				display: { role: 'Display', spec: 'Hanken Grotesk · 30px · 500' },
				headline: { role: 'Headline', spec: 'Hanken Grotesk · 24px · 500' },
				label: { role: 'Label', spec: 'Hanken Grotesk · 14px · 500' },
				mono: { role: 'Mono', spec: 'Calling Code · 12px · 400' },
				title: { role: 'Title', spec: 'Hanken Grotesk · 18px · 600' },
				wordmark: { role: 'Wordmark', spec: 'Fugaz One · 24–30px · 400 · "Xat" only' },
			},
			scaleTitle: 'Hierarchy',
			specimensTitle: 'Specimens',
			title: 'Typography',
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
