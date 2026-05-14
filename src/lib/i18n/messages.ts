import type { Locale } from '@/lib/i18n/constants'

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
	footer: {
		connect: string
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
		emptyCapabilityDescription: string
		emptyCapabilityTitle: string
		introAfterProducts: string
		introBeforeSystems: string
		introBetweenBadges: string
		/** `<meta name="description">` and default JSON-LD site blurbs for the home page. */
		metaDescription: string
		proofCta: string
		proofDescription: string
		proofEyebrow: string
		proofTitle: string
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
	footer: {
		connect: 'Connect through any of these:',
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
		emptyCapabilityDescription: 'Links when there is something worth flexing.',
		emptyCapabilityTitle: 'Work in progress',
		introAfterProducts: '.',
		introBeforeSystems: 'A ',
		introBetweenBadges: ' taught me to balance design intent, engineering constraints, and the messy realities of building ',
		metaDescription:
			'Design Engineer building AI-native products, interfaces, and frontend systems. Writing on frontend craft, design systems, and tools.',
		proofCta: 'View project source',
		proofDescription:
			'A real product surface: repositioning an AI chat app with cleaner hierarchy, sharper copy, and production-ready frontend details.',
		proofEyebrow: 'Selected proof',
		proofTitle: 'OpenCat.app redesign',
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

const zh: Messages = {
	blog: {
		archiveSubtitle: '归档 — 文字在脑海里发光',
		goHome: '回到首页',
		pageDescription: '关于前端工程、设计系统、AI 产品、工具，以及 Xat 的零碎记录。',
		pageTitle: '写作 - Xat',
		title: '全部文章',
	},
	capabilities: [
		{
			items: [
				{
					description: '👨‍🎨 OpenCat 网站重设计',
					title: 'OpenCat.app',
				},
			],
			summary: '对话界面、智能体、编排，把智能当作体验本身，而不是事后补丁。',
			title: 'AI 产品体验',
		},
		{
			items: [
				{
					description: '🍤 一个模板而已',
					title: 'Monorepo 模板',
				},
			],
			summary: '架构、性能预算与可随产品演进的组件体系。',
			title: '前端系统',
		},
		{
			items: [
				{
					description: '📒 面向现代项目的严格 TypeScript 配置',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat 的 ESLint 预设',
					title: 'ESLint-Config',
				},
			],
			summary: '严格的默认规则、Lint 与工作流，让团队安心持续交付。',
			title: '开发者体验',
		},
		{
			emptyState: {
				description: '动效与微交互的安静实验 —— 值得展示时再上链接。',
				title: '进行中',
			},
			items: [],
			summary: '动效、微交互，以及让复杂工具仍然有人情味的细节。',
			title: '界面工艺',
		},
	],
	categories: {
		design: {
			description: '满足审美的小小执念',
			name: '设计',
		},
		life: {
			description: '简单生活的气泡',
			name: '生活',
		},
		tech: {
			description: '关于技术的随想',
			name: '技术',
		},
	},
	footer: {
		connect: '可以通过这些方式联系：',
	},
	header: {
		goHome: '回到首页',
		theme: {
			ariaLabel: '主题',
			dark: '深色',
			light: '浅色',
			system: '跟随系统',
		},
	},
	home: {
		bioLead: '打造生产级界面与 AI 原生产品',
		bioP1: '我设计并交付应用型 AI 界面、工作流与开发者工具。',
		capabilitiesEyebrow: '能力',
		emptyCapabilityDescription: '有值得展示的成果时会补上链接。',
		emptyCapabilityTitle: '进行中',
		introAfterProducts: '。',
		introBeforeSystems: '',
		introBetweenBadges: '让我学会在设计意图、工程约束与真实落地的混乱之间找平衡，去构建',
		metaDescription:
			'设计工程师，专注 AI 原生产品与前端系统。写作涵盖前端工程、设计系统、工具与实践笔记。',
		proofCta: '查看项目源码',
		proofDescription:
			'一个真实产品界面：重新梳理 AI 聊天应用的层级、文案与可落地的前端细节。',
		proofEyebrow: '精选证明',
		proofTitle: 'OpenCat.app 重设计',
		role: '设计工程师',
		tagline: 'Xat - 设计工程师',
		title: 'Xat - 设计工程师',
		viewAllPosts: '查看全部',
		writingEyebrow: '写作',
	},
	localeSwitcher: {
		ariaLabel: '语言',
	},
	wanderer: {
		wanderer: '旅人',
		withCountry: {
			bridge: '的',
			closing: '。',
			lead: '你好，来自',
			pattern: 'eastAsia',
		},
		withoutCountry: {
			after: '——很高兴你来到这里。',
			before: '你好，',
		},
	},
}

const ja: Messages = {
	blog: {
		archiveSubtitle: 'アーカイブ — 言葉が頭の中できらめく',
		goHome: 'ホームへ',
		pageDescription: 'フロントエンド、デザインシステム、AI プロダクト、ツール、Xat のメモ。',
		pageTitle: 'Writing - Xat',
		postTranslatedNotice: {
			afterLink: 'に切り替えると著者による原文を読めます。',
			beforeLink: 'この記事は中国語の原文をAIが翻訳したものです。サイトの言語を',
			switchToChineseAriaLabel: 'サイトの表示言語を中文に切り替えて原文を表示する',
		},
		title: 'すべての記事',
	},
	capabilities: [
		{
			items: [
				{
					description: '👨‍🎨 OpenCat サイトのリデザイン',
					title: 'OpenCat.app',
				},
			],
			summary: 'チャット UI、エージェント、オーケストレーション。知能をあと付けではなく体験として扱う。',
			title: 'AI プロダクト体験',
		},
		{
			items: [
				{
					description: '🍤 テンプレートです',
					title: 'Monorepo テンプレート',
				},
			],
			summary: 'アーキテクチャ、性能予算、プロダクトと伸びるコンポーネント設計。',
			title: 'フロントエンド基盤',
		},
		{
			items: [
				{
					description: '📒 現代的なプロジェクト向けの厳格な TypeScript 設定',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat の ESLint プリセット',
					title: 'ESLint-Config',
				},
			],
			summary: '厳しめのデフォルト、Lint、チームが安全に出せるワークフロー。',
			title: '開発者体験',
		},
		{
			emptyState: {
				description: 'モーションの静かな R&D — 見せ場が来たらリンクを。',
				title: '作業中',
			},
			items: [],
			summary: 'モーション、マイクロインタラクション、密度の高いツールに人間味を足す細部。',
			title: 'インターフェースの作り込み',
		},
	],
	categories: {
		design: {
			description: '審美を満たすこと',
			name: 'デザイン',
		},
		life: {
			description: 'かんたんな日常のひとこま',
			name: '生活',
		},
		tech: {
			description: 'テクノロジーについて',
			name: 'テック',
		},
	},
	footer: {
		connect: 'こちらからどうぞ：',
	},
	header: {
		goHome: 'ホームへ',
		theme: {
			ariaLabel: 'テーマ',
			dark: 'ダーク',
			light: 'ライト',
			system: 'システム',
		},
	},
	home: {
		bioLead: '本番品質の UI と AI ネイティブなプロダクトをつくる',
		bioP1: '応用 AI のインターフェース、ワークフロー、開発者向けツールを設計し届ける。',
		capabilitiesEyebrow: 'できること',
		emptyCapabilityDescription: '見せられるものができたらリンクを載せます。',
		emptyCapabilityTitle: '作業中',
		introAfterProducts: 'を形にする。',
		introBeforeSystems: '',
		introBetweenBadges: 'という背景から、設計意図・実装制約・現場の複雑さのバランスを学び、',
		metaDescription:
			'デザインエンジニア。AI ネイティブなプロダクトとフロントエンドをつくる。フロントエンド、デザインシステム、ツールのメモ。',
		proofCta: 'ソースを見る',
		proofDescription:
			'実プロダクトの表面を、AI チャットアプリとしての階層、コピー、本番向けの実装細部まで整え直す。',
		proofEyebrow: '選んだ実例',
		proofTitle: 'OpenCat.app リデザイン',
		role: 'デザインエンジニア',
		tagline: 'Xat - デザインエンジニア',
		title: 'Xat - デザインエンジニア',
		viewAllPosts: 'すべて見る',
		writingEyebrow: 'ライティング',
	},
	localeSwitcher: {
		ariaLabel: '言語',
	},
	wanderer: {
		wanderer: '旅人',
		withCountry: {
			bridge: 'からの',
			closing: 'さん。',
			lead: 'こんにちは、',
			pattern: 'eastAsia',
		},
		withoutCountry: {
			after: 'さん。ここに辿り着いてくれてうれしい。',
			before: 'こんにちは、',
		},
	},
}

export const messages: Record<Locale, Messages> = {
	en,
	ja,
	zh,
}

export function getMessages(locale: Locale): Messages {
	return messages[locale]
}
