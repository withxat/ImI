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
				content: {
					description: 'Text and icons.',
					title: 'Content',
				},
				highlight: {
					description: 'Quiet Rose in light, Warm Apricot in dark: straight rose turns muddy on deep ink. Together they stay under 10% of any screen.',
					title: 'Highlight',
				},
				status: {
					description: 'Reserved for callouts and errors. Nothing on the site needs them yet.',
					title: 'Status',
				},
				surface: {
					description: 'The page and what sits on it.',
					title: 'Surface',
				},
				washEdges: {
					description: 'Hover fills, inline code, and the hairlines around bounded surfaces.',
					title: 'Wash & edges',
				},
			},
			modeLabel: {
				dark: 'Dark',
				light: 'Light',
			},
			roles: {
				accent: 'Hover fill on cards',
				background: 'The page',
				border: 'Hairlines on cards, tables, dividers',
				card: 'bejamas cards',
				destructive: 'Errors, destructive actions',
				foreground: 'Headings and body text',
				highlightIcon: 'Interactive icon tint',
				highlightSoft: 'Link underlines, hover halos',
				highlightText: 'Wordmark, emphasis, link hover',
				info: 'Neutral notices',
				muted: 'Callouts, inline code',
				mutedForeground: 'Descriptions, metadata, captions',
				popover: 'Popovers, home link cards',
				primary: 'Filled buttons, footer icons',
				success: 'Confirmation',
				surface: 'Table headers',
				warning: 'Caution',
			},
			tablistLabel: 'Palette mode',
			title: 'Colors',
		},
		components: {
			cardDescription: 'An Astro-native component library.',
			cardTitle: 'bejamas/ui',
			intro: 'Primitives come from bejamas/ui and stay unedited so they can be re-pulled. Anything site-specific wraps them instead.',
			particlesIntro: 'Built here because nothing off the shelf fit.',
			particlesTitle: 'Particles',
			primeIntro: 'Buttons, badges, popovers, dialogs.',
			primeTitle: 'Prime',
			statDigitsDescriptor: 'Metallic odometer digits for the footer view count',
			textLinkDescriptor: 'Underline painted with gradients: 0.1em bar, round caps, unbroken across line wraps',
			title: 'Components',
			wandererDescriptor: 'The only gradient text on the site: rose to cyan in the footer, where it greets you by country',
		},
		elevation: {
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: 'Cards, intro badges, popovers, callouts',
			imageEdgeDescription: '1px ink ring + shadow-halo, no layout cost',
			imageEdgeLabel: 'Screenshots and illustrations in posts',
			intro: 'Surfaces sit flat; hairlines draw their edges. The one shadow is a 1–2px rose tint under things you can click. Light mode never uses black shadows; dark mode switches to black at 35–40%, since tints wash out on ink.',
			title: 'Elevation',
		},
		eyebrow: 'Design System',
		flipMascot: 'Flip mascot',
		northStar: {
			tagline: 'Cute is the coin above (flip it) and the Fugaz One “Xat”. Shiny is the faint rose halo under anything clickable. Elegant is three scripts, each broken into lines the way its own typography expects.',
			title: 'Cute, shiny, and elegant',
		},
		pageDescription: 'How xat.sh is put together visually: type, color tokens, elevation, components, and the few rules it keeps.',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'Code blocks keep the Vesper canvas in both themes. Its syntax colors are tuned for that background, so the theme toggle stops at the code-block frame.',
					name: 'Code is always dark',
				},
				{
					body: 'In light mode, selected text turns pale honey instead of rose, so a sentence highlighted mid-read never looks clickable.',
					name: 'Selection is not a link',
				},
				{
					body: 'It has no business being here except that it is fun, so it gets three letters and nothing more.',
					name: 'Fugaz One spells only “Xat”',
				},
			],
			title: 'House rules',
		},
		typography: {
			intro: 'Hanken Grotesk sets Latin; MiSans sets Chinese and Japanese. MiSans is cut into static instances at CJK weights tuned to match Hanken at each font-weight, so no element touches font-variation-settings: an override would skip that curve.',
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
				wordmark: { role: 'Wordmark', spec: 'Fugaz One · 24–30px · 400' },
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
