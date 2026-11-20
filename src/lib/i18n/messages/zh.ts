import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const zh: Messages = {
	blog: {
		goHome: '回到首页',
		pageDescription: '关于前端、设计、AI，以及 Xat 的零碎记录。',
		pageTitle: 'Xat 的归档处',
		title: '全部文章',
	},
	capabilities: [
		{
			items: [],
			title: 'AI 体验',
		},
		{
			items: [
				{
					description: '🍤 TypeScript Monorepo 模板',
					title: 'Monorepo-Template',
				},
			],
			title: '前端工程化',
		},
		{
			items: [
				{
					description: '📒 面向现代项目的严格 TypeScript 配置',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat 自用强迫症 ESLint 配置',
					title: 'ESLint-Config',
				},
			],
			title: '开发工具链',
		},
		{
			items: [
				{
					description: '😀 将 Unicode Emoji 渲染为 Fluent Emoji 的 Rehype 插件',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: '🍊 一个温暖、简洁的 Astro 博客模板',
					title: 'Mikan',
				},
				{
					description: '🫧 我的个人网站和数字花园',
					title: 'ImI',
				},
			],
			title: '界面与交互',
		},
	],
	categories: {
		design: {
			name: '设计',
		},
		life: {
			name: '生活',
		},
		tech: {
			name: '技术',
		},
	},
	codeBlock: codeBlockByLocale.zh,
	design: {
		colors: {
			groups: {
				code: '代码块',
				content: '文字',
				highlight: '强调色',
				status: '状态色',
				surface: '底色',
				washEdges: '填充与边框',
			},
			modeLabel: {
				dark: '深色',
				light: '浅色',
			},
			roles: {
				background: '页面',
				border: '1px 细线',
				code: 'Vesper 代码底色',
				codeForeground: '代码文字',
				foreground: '主文字 · primary',
				highlightBrand: '字标 · 旅人',
				highlightIcon: '图标着色',
				highlightSoft: '下划线 · 光晕',
				highlightText: '链接 · 强调',
				muted: '悬停 · 行内代码 · accent',
				mutedForeground: '次要文字',
				selection: '文字选中',
				status: '预留',
				surface: '卡片 · 弹层',
			},
			title: '配色',
		},
		eyebrow: '设计系统',
		flipMascot: '翻一下硬币',
		geometry: {
			haloLabel: '徽章 · 译文提示',
			imageEdgeLabel: '文章图片',
			radiiTitle: '圆角',
			shadowsTitle: '阴影',
			title: '形状与阴影',
		},
		motion: {
			replay: '重播',
			slow: '0.25×',
			title: '动效',
		},
		pageDescription: '驱动 xat.sh 的设计系统 —— 字体、色彩、三语排版、层次与动效。',
		pageTitle: '设计系统 - Xat',
		typography: {
			families: {
				callingCode: '代码与等宽',
				fugazOne: '仅「Xat」',
				hankenGrotesk: '西文',
				miSans: '中日文 · wght 330/415/500 对齐 Hanken',
				sourceHanSerif: '首页导语',
			},
			scale: {
				bioLead: '导语',
				body: '正文',
				display: '大标题',
				headline: '二级标题',
				label: '标签',
				mono: '等宽',
				title: '小标题',
				wordmark: '字标',
			},
			scaleTitle: '字号',
			title: '字体',
		},
		wrapping: {
			rulesOff: ':lang() 规则：关',
			rulesOn: ':lang() 规则：开',
			title: '三语断行',
			widthLabel: '栏宽',
		},
	},
	footer: {
		moeIcp: '萌ICP备20264698号',
		stats: {
			afterOnline: '人路过',
			afterTotal: '次',
			beforeOnline: '此刻',
			beforeTotal: '被围观',
		},
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
		bioLead: '爱打磨界面，也喜欢探索 AI 的可能性。',
		introAfterProducts: '。',
		introBeforeSystems: '',
		introBetweenBadges: '让我习惯在设计、工程与真实需求之间寻找平衡，去构建',
		metaDescription:
			'设计工程师，专注 AI 与前端，写些关于前端、设计、AI 的文章。',
		notFound: {
			description: '这里好像什么也没有，页面可能已经搬家了。',
			title: '页面未找到',
		},
		playName: '播放名字读音',
		projectsEyebrow: '项目',
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

export default zh
