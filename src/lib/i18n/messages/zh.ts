import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

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
	codeBlock: codeBlockByLocale.zh,
	design: {
		colors: {
			groups: {
				content: {
					description: '文字与图标的前景色阶。',
					title: '内容',
				},
				highlight: {
					description: '品牌色。克制地用于标识、强调与链接示意。',
					title: '高亮',
				},
				status: {
					description: '语义化反馈。以意图驱动，而非装饰。',
					title: '状态',
				},
				surface: {
					description: '页面画布、抬升的面板与浮层。暗色模式下层级有差异，亮色模式下统一为白，靠边框而非填充区分。',
					title: '表面',
				},
				washEdges: {
					description: '用于 hover/选中态的弱底色，以及结构性的细线分隔。',
					title: '底色与边线',
				},
			},
			intro: {
				after: ' 渲染，永远以源文件为准 —— 即使在相反主题下预览，也能看到真实的亮 / 暗色值。',
				before: '色彩 token 定义在 ',
				middle1: ' 中。下方两个色板通过作用域类 ',
				middle2: ' / ',
			},
			roles: {
				accent: '交互态底色（hover、pressed）',
				background: '页面画布',
				border: '细线分隔',
				card: '卡片填色（surface 的别名）',
				destructive: '错误、破坏性操作',
				foreground: '主文字色',
				highlightIcon: '品牌图标着色',
				highlightSoft: '品牌弱底',
				highlightText: '品牌强调文字',
				info: '信息',
				muted: '静态弱底色',
				mutedForeground: '次级文字色',
				popover: '浮层（popover、菜单）',
				primary: '主操作填色（墨色反转）',
				success: '确认、正向',
				surface: '内嵌承载面（卡片、面板）',
				warning: '警示',
			},
			title: '色彩',
		},
		eyebrow: '设计系统',
		flipMascot: '翻转吉祥物',
		pageDescription: '驱动 xat.sh 的设计系统 —— 字体、色彩 token，以及保持界面一致的规则。',
		pageTitle: '设计系统 - Xat',
		typography: {
			sampleDescriptors: {
				accent: '点缀',
				cjk: '中日韩',
				display: '显示与界面',
				mono: '等宽',
				serif: '衬线',
			},
			title: '字体',
		},
	},
	footer: {
		connect: '可以通过这些方式联系：',
		moeIcp: '萌ICP备20264698号',
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
		capabilitiesIntro: '我反复打磨的交叉点：产品界面、前端系统、开发工具，以及它们之间那些微小但重要的交互细节。',
		emptyCapabilityDescription: '有值得展示的成果时会补上链接。',
		emptyCapabilityTitle: '进行中',
		introAfterProducts: '。',
		introBeforeSystems: '',
		introBetweenBadges: '让我学会在设计意图、工程约束与真实落地的混乱之间找平衡，去构建',
		metaDescription:
			'设计工程师，专注 AI 原生产品与前端系统。写作涵盖前端工程、设计系统、工具与实践笔记。',
		notFound: {
			description: '你访问的页面不存在或已被移动。',
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
