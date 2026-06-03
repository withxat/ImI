import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const en: Messages = {
	blog: {
		archiveSubtitle: 'Archive — texts just sparkle in my mind',
		goHome: 'Go to home',
		pageDescription: 'Writing about frontend engineering, design systems, AI products, tools, and small notes from Xat.',
		pageTitle: 'Writing - Xat',
		postTranslatedNotice: {
			afterLink: ' to read the author-written source text.',
			beforeLink: 'This article is an AI translation from the Chinese original. Switch the site language to ',
			switchToChineseAriaLabel: 'Switch site language to Chinese for the original article',
		},
		title: 'All writings',
	},
	capabilities: [
		{
			items: [
				{
					description: '👨‍🎨 Redesign OpenCat website',
					title: 'OpenCat.app',
				},
			],
			summary: 'Chat surfaces, agents, orchestration, and treating intelligence as UX—not a bolt-on.',
			title: 'AI product experiences',
		},
		{
			items: [
				{
					description: '🍤 Just a template',
					title: 'Monorepo template',
				},
			],
			summary: 'Architecture, performance budgets, and component systems that scale with the product.',
			title: 'Frontend systems',
		},
		{
			items: [
				{
					description: '📒 A strict TypeScript configuration for modern project',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat\'s ESLint config preset',
					title: 'ESLint-Config',
				},
			],
			summary: 'Strict defaults, lint rules, and workflows that keep teams shipping safely.',
			title: 'Developer experience',
		},
		{
			emptyState: {
				description: 'Quiet motion R&D—links when it\'s showtime.',
				title: 'Work in progress',
			},
			items: [],
			summary: 'Motion, micro-interactions, and the invisible details that make dense tools feel humane.',
			title: 'Interface craft',
		},
	],
	categories: {
		design: {
			description: 'Satisfying my aesthetic',
			name: 'Design',
		},
		life: {
			description: 'Bubbles of simple life',
			name: 'Life',
		},
		tech: {
			description: 'Thoughts on technology',
			name: 'Tech',
		},
	},
	codeBlock: codeBlockByLocale.en,
	design: {
		colors: {
			groups: {
				content: {
					description: 'Foreground tones for text and iconography.',
					title: 'Content',
				},
				highlight: {
					description: 'Brand voice. Used sparingly to mark identity, emphasis, and link affordance.',
					title: 'Highlight',
				},
				status: {
					description: 'Semantic feedback. Use intent over decoration.',
					title: 'Status',
				},
				surface: {
					description: 'Page canvas, raised panels, and overlays. In dark mode the layers are stepped; in light mode they collapse to white and are separated by border instead of fill.',
					title: 'Surface',
				},
				washEdges: {
					description: 'Soft fills for hover/selected states and structural lines.',
					title: 'Wash & Edges',
				},
			},
			intro: 'Both palettes show side by side on wide screens; tap to swap on narrow ones. Defaults to your current theme.',
			modeLabel: {
				dark: 'Dark',
				light: 'Light',
			},
			roles: {
				accent: 'Interactive wash (hover, pressed)',
				background: 'Page canvas',
				border: 'Hairline separators',
				card: 'Card fill (alias of surface)',
				destructive: 'Error, destructive action',
				foreground: 'Primary ink',
				highlightIcon: 'Brand icon tint',
				highlightSoft: 'Soft brand wash',
				highlightText: 'Brand text accent',
				info: 'Informational',
				muted: 'Static wash',
				mutedForeground: 'Secondary ink',
				popover: 'Floating layer (popover, menu)',
				primary: 'Primary action fill (mono-ink)',
				success: 'Confirmation, positive',
				surface: 'Inline surface (cards, panels)',
				warning: 'Caution',
			},
			tablistLabel: 'Palette mode',
			title: 'Colors',
		},
		components: {
			cardDescription: 'Astro-native components. Copy and own the code.',
			cardTitle: 'bejamas/ui',
			intro: 'Two layers: primitives imported wholesale, and the small composed pieces we build on top.',
			particlesIntro: 'The thin layer above prime. Project-specific affordances that carry the site\'s voice.',
			particlesTitle: 'Particles',
			primeIntro: 'Buttons, badges, popovers, dialogs. Copied wholesale from bejamas/ui and left alone.',
			primeTitle: 'Prime',
			textLinkDescriptor: 'Pill underline with rounded end caps, not text-decoration',
			title: 'Components',
			wandererDescriptor: 'Animated gradient text, footer-only emphasis',
		},
		elevation: {
			flatNote: 'Surfaces are flat at rest. Depth is carried by hairlines, not lift.',
			intro: 'One whisper shadow tinted with highlight-soft. No glass, no drop shadows, no elevation theatre.',
			title: 'Elevation',
		},
		eyebrow: 'Design System',
		flipMascot: 'Flip mascot',
		northStar: {
			characteristics: [
				'Mono-ink + one accent (Quiet Rose / Warm Apricot)',
				'Hairlines over fills',
				'Trilingual typography (en / zh / ja)',
				'Reveal on entry, 420ms ease-out-quart',
				'Single-column narrow (42rem max)',
			],
			tagline: 'Engineering precision wearing a soft glow. The accent is the voice; its rarity is the point.',
			title: 'Cute with Shiny Elegance',
		},
		pageDescription: 'The design system that powers xat.sh — typography, color tokens, elevation, components, and the rules that keep the surface coherent.',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text and highlight-soft together occupy ≤10% of any screen.',
					name: 'The One Voice Rule',
				},
				{
					body: 'In light mode, surface, card, and popover collapse to background. Separate with border, not fill.',
					name: 'The Hairlines-Not-Walls Rule',
				},
				{
					body: 'font-fugaz-one is forbidden anywhere except on the literal text "Xat".',
					name: 'The One Wordmark Rule',
				},
				{
					body: 'background-clip: text gradient appears only in the footer wanderer line.',
					name: 'The One Gradient Rule',
				},
				{
					body: 'Code blocks stay Vesper-dark in both light and dark site modes.',
					name: 'The Code Stays Dark Rule',
				},
			],
			title: 'Named rules',
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
		connect: 'Connect through any of these:',
		moeIcp: 'Moe ICP Filing No. 20264698',
		stats: {
			afterOnline: 'wandering now',
			afterTotal: 'times',
			beforeOnline: '',
			beforeTotal: 'Seen',
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
		bioLead: 'Building production-quality interfaces and AI-native products',
		bioP1: 'I design and ship applied AI interfaces, workflows, and developer tools.',
		capabilitiesEyebrow: 'Capabilities',
		capabilitiesIntro: 'The overlap I keep returning to: product surfaces, frontend systems, developer tooling, and the tiny interaction details between them.',
		emptyCapabilityDescription: 'Links when there is something worth flexing.',
		emptyCapabilityTitle: 'Work in progress',
		introAfterProducts: '.',
		introBeforeSystems: 'A ',
		introBetweenBadges: ' taught me to balance design intent, engineering constraints, and the messy realities of building ',
		metaDescription:
			'Design Engineer building AI-native products, interfaces, and frontend systems. Writing on frontend craft, design systems, and tools.',
		notFound: {
			description: 'The page you\'re looking for doesn\'t exist or has been moved.',
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
			after: '—glad you found your way here.',
			before: 'Hi, ',
		},
	},
}

export default en
