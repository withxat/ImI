import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const zh: Messages = {
	blog: {
		archiveSubtitle: '归档处 — 有些文字会慢慢发光。',
		goHome: '回到首页',
		pageDescription: '关于前端、设计、AI，以及 Xat 的零碎记录。',
		pageTitle: 'Xat 的归档处',
		title: '全部文章',
	},
	capabilities: [
		{
			emptyState: {
				description: '只想展示让自己满意的作品。',
				title: '暂无案例',
			},
			items: [],
			summary: '让 AI 能用，还得让人乐意用。',
			title: 'AI 体验',
		},
		{
			items: [
				{
					description: '🍤 TypeScript Monorepo 模板',
					title: 'Monorepo-Template',
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
			summary: '把架构、性能和长期维护一起做好。',
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
			summary: '折腾配置与工作流，不在同一个坑摔两次。',
			title: '开发工具链',
		},
		{
			items: [
				{
					description: '😀 将 Unicode Emoji 渲染为 Fluent Emoji 的 Rehype 插件',
					title: 'Rehype-Fluent-Emoji',
				},
			],
			summary: '琢磨动效与交互细节，让界面更顺手，也更耐看。',
			title: '界面与交互',
		},
	],
	categories: {
		design: {
			description: '满足审美的执念',
			name: '设计',
		},
		life: {
			description: '关于日常的气泡',
			name: '生活',
		},
		tech: {
			description: '开发相关的随想',
			name: '技术',
		},
	},
	codeBlock: codeBlockByLocale.zh,
	design: {
		colors: {
			groups: {
				content: {
					description: '文字与图标的基础色。',
					title: '内容',
				},
				highlight: {
					description: '品牌色。克制地用在强调的地方。',
					title: '高亮',
				},
				status: {
					description: '语义化反馈。先表达意图，再考虑装饰。',
					title: '状态',
				},
				surface: {
					description: '页面主体、面板与浮层。',
					title: '表面',
				},
				washEdges: {
					description: '用于交互状态的弱底色，以及封闭表面的轻边界。',
					title: '底色与边界',
				},
			},
			intro: '宽屏并排展示两套色板，窄屏可切换查看，默认跟随当前主题。',
			modeLabel: {
				dark: '深色',
				light: '浅色',
			},
			roles: {
				accent: '交互态弱底色',
				background: '页面背景',
				border: '边框',
				card: '卡片填色',
				destructive: '错误、破坏性操作',
				foreground: '主文字色',
				highlightIcon: '品牌图标色',
				highlightSoft: '品牌弱底色',
				highlightText: '品牌强调文字',
				info: '信息',
				muted: '弱底色',
				mutedForeground: '弱文字色',
				popover: '浮层',
				primary: '主操作填色',
				success: '成功、确认',
				surface: '表面',
				warning: '警告',
			},
			tablistLabel: '色板模式',
			title: '色彩',
		},
		components: {
			cardDescription: 'Astro 原生组件库。',
			cardTitle: 'bejamas/ui',
			intro: '两层结构：一层保留 primitive 原样，另一层在它们之上组合出站点自己的组件。',
			particlesIntro: '符合本站整体气质的小零件。',
			particlesTitle: 'Particles',
			primeIntro: '按钮、徽章、弹层、对话框，来自 bejamas/ui。',
			primeTitle: 'Prime',
			statDigitsDescriptor: '用于页脚实时访问量统计，金属质感的转盘数字',
			textLinkDescriptor: '圆角胶囊下划线',
			title: '组件',
			wandererDescriptor: '渐变动效文字，仅用于页脚的文本装饰',
		},
		elevation: {
			flatNote: '表面默认平贴页面。细线界定边缘，柔光提示交互。',
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: '可交互表面的标志性柔光边缘',
			imageEdgeDescription: '1px 墨色边缘 · shadow-halo',
			imageEdgeLabel: '文章媒体边缘',
			intro: '轻阴影以 highlight-soft 着色。用来表示可交互性。',
			title: '层次',
		},
		eyebrow: '设计系统',
		flipMascot: '翻转吉祥物',
		northStar: {
			characteristics: [
				'墨色主色调 + 单强调色（静谧玫瑰 / 暖杏）',
				'用留白、节奏与排版对齐组织页面',
				'三语排版优化（中 / 英 / 日）',
				'入场渐显动画，420ms ease-out-quart',
				'响应式设计，单栏窄版（最大 42rem）',
			],
			tagline: '骨架精密，表面柔软。强调色只在需要的时候出现。',
			title: '可爱、闪亮，也优雅',
		},
		pageDescription: '驱动 xat.sh 的设计系统 —— 字体、色彩 token、层次、组件，以及保持一致性的原则。',
		pageTitle: '设计系统 - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text 与 highlight-soft 在单个屏幕中占比不超过 10%。',
					name: '单一声音原则',
				},
				{
					body: '用留白、节奏和排版对齐组织页面；细线仅界定需要边界的表面。',
					name: '留白优先原则',
				},
				{
					body: 'font-fugaz-one 仅用在 Logo 文本「Xat」。',
					name: '单一字标原则',
				},
				{
					body: 'background-clip: text 渐变仅出现在页脚 wanderer 一行。',
					name: '单一渐变原则',
				},
				{
					body: '代码块在亮 / 暗站点模式下均保持 Vesper 深色。',
					name: '代码恒暗原则',
				},
			],
			title: '设计原则',
		},
		typography: {
			sampleDescriptors: {
				accent: '点缀',
				cjk: '中日韩',
				display: '显示与界面',
				mono: '等宽',
				serif: '衬线',
			},
			scale: {
				bioLead: { role: '导语', spec: '思源宋体 SC · 16px / 28px · 600' },
				body: { role: '正文', spec: 'Hanken Grotesk + 小米 Sans · 16px / 28px · 400' },
				display: { role: '展示', spec: 'Hanken Grotesk · 30px · 500' },
				headline: { role: '标题', spec: 'Hanken Grotesk · 24px · 500' },
				label: { role: '标签', spec: 'Hanken Grotesk · 14px · 500' },
				mono: { role: '等宽', spec: 'Calling Code · 12px · 400' },
				title: { role: '小标题', spec: 'Hanken Grotesk · 18px · 600' },
				wordmark: { role: '字标', spec: 'Fugaz One · 24–30px · 400 · 仅「Xat」' },
			},
			scaleTitle: '层级',
			specimensTitle: '字样',
			title: '字体',
		},
	},
	footer: {
		connect: '可以通过这些方式抓到我：',
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
		bioP1: '我想把设计和技术放在一起，解决真实的问题。',
		capabilitiesEyebrow: '能力',
		capabilitiesIntro: '产品、设计和工程之间，那些微小但重要的细节总让我着迷。',
		emptyCapabilityDescription: '等它准备好了，就会出现在这里。',
		emptyCapabilityTitle: '进行中',
		introAfterProducts: '。',
		introBeforeSystems: '',
		introBetweenBadges: '让我习惯在设计、工程与真实需求之间寻找平衡，去构建',
		metaDescription:
			'设计工程师，专注 AI 与前端，写些关于前端、设计、AI 的文章。',
		notFound: {
			description: '这里好像什么也没有，页面可能已经搬家了。',
			goHome: '回到首页',
			title: '页面未找到',
		},
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
