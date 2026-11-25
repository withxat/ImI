import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const zh: Messages = {
	blog: {
		goHome: '回到首页',
		moreWriting: '更多文章',
		newer: '较新',
		older: '较早',
		pageDescription: '关于前端、设计、AI，以及 Xat 的零碎记录。',
		pageTitle: 'Xat 的归档处',
		postCountSuffix: ' 篇',
		readingTime: (minutes: number) => `约 ${minutes} 分钟`,
		sectionCount: (count: number) => `${count} 节`,
		title: '全部文章',
		toc: '目录',
		viewSource: '查看源码',
	},
	capabilities: [
		{
			items: [],
			title: 'AI 体验',
		},
		{
			items: [
				{
					description: 'TypeScript Monorepo 脚手架模板',
					title: 'Monorepo-Template',
				},
			],
			title: '前端工程化',
		},
		{
			items: [
				{
					description: '自用的严格 TypeScript 配置预设',
					title: 'TSConfig',
				},
				{
					description: 'Xat 自用强迫症 ESLint 预设',
					title: 'ESLint-Config',
				},
			],
			title: '开发工具链',
		},
		{
			items: [
				{
					description: '渲染为 Fluent Emoji，复制时仍保留原 Unicode',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: '从本站拆出来的极简 Astro 博客模板',
					title: 'Mikan',
				},
				{
					description: 'SwiftUI 写的 iPhone 端 Cloudflare 客户端，带小组件和实时活动',
					title: 'Dash',
				},
				{
					description: '我的个人网站',
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
		pageDescription: 'xat.sh 的设计系统：字体、配色、三语排版、圆角阴影与动效，数值全部读自线上 CSS。',
		pageTitle: '设计系统 - Xat',
		typography: {
			families: {
				callingCode: '代码与等宽',
				fugazOne: '仅「Xat」',
				hankenGrotesk: '西文',
				miSans: '中日文',
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
			weightsMatchOff: '对齐：关',
			weightsMatchOn: '对齐：开',
			weightsNote: '同一个 font-weight 下，MiSans 的笔画要比 Hanken 粗一圈，所以每一档的 wght 都是我对着 Hanken 手动对的。关掉对齐，天平就歪了。',
			weightsTitle: '字重',
		},
		wrapping: {
			rulesOff: ':lang() 规则：关',
			rulesOn: ':lang() 规则：开',
			title: '三语断行',
			widthLabel: '栏宽',
		},
	},
	footer: {
		copyEmail: '复制邮箱地址',
		emailCopied: '复制好啦',
		moeIcp: '萌ICP备20264698号',
		stats: {
			afterOnline: '人路过',
			afterTotal: '次',
			alone: '此刻只有你在闲逛',
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
		bioLead: '喜欢把界面磨顺手，也爱拿 AI 做些真正好用的东西。',
		introAfterProducts: '。',
		introBeforeSystems: '',
		introBetweenBadges: '让我习惯从结构看问题，现在主要做前端和',
		metaDescription:
			'Xat，Design Engineer，做前端与 AI 产品，写些关于代码、设计与日常的笔记。',
		notFound: {
			description: '链接可能过期了，或者字敲错了。不如先看看最近写的文章。',
			didYouMean: {
				after: '》？',
				before: '是不是在找《',
			},
			title: '这里什么也没有',
		},
		playName: '播放名字读音',
		poke: {
			label: '戳一下 Xat',
			lines: ['嗨～', '在呢', '有点痒', '别戳啦'],
			sulk: '哼，不理你了',
		},
		projectsEyebrow: '项目',
		role: 'Design Engineer',
		spotlight: {
			description: '你正在看的这个站。用 Astro 7 搭在 Cloudflare Workers 上，做了三语、手调中英字重和按字形裁剪字体，/design 页里的数值全部读自线上样式。',
			source: 'GitHub 源码',
			title: '本站与设计系统',
		},
		tagline: 'Xat - Design Engineer',
		title: 'Xat - Design Engineer',
		toolsShelfLabel: '工具与配置',
		viewAllPosts: '查看全部',
		writingEyebrow: '写作',
	},
	localeSwitcher: {
		ariaLabel: '语言',
	},
	resume: {
		pageDescription: 'Design Engineer Xat 的简历：AI 原生产品、前端工程与界面打磨。',
		pageTitle: '简历 - Xat',
		present: '至今',
		print: '打印或存为 PDF',
		sections: {
			education: '教育',
			experience: '经历',
			openSource: '开源贡献',
			projects: '个人项目',
			skills: '技能',
		},
		title: '简历',
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
