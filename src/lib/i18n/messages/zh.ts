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
			intro: '宽屏并排展示两套色板，窄屏可切换查看，默认跟随当前主题。',
			modeLabel: {
				dark: '深色',
				light: '浅色',
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
			tablistLabel: '色板模式',
			title: '色彩',
		},
		components: {
			cardDescription: 'Astro 原生组件，复制即拥有。',
			cardTitle: 'bejamas/ui',
			intro: '两层结构：整段引入的 primitive，和在它们之上自行组合出的小件。',
			particlesIntro: 'Prime 之上薄薄一层，承载本站气质的项目自有零件。',
			particlesTitle: 'Particles',
			primeIntro: '按钮、徽章、弹层、对话框，整段从 bejamas/ui 复制过来，原样保留。',
			primeTitle: 'Prime',
			textLinkDescriptor: '带箭头的内联链接，行文里使用',
			title: '组件',
			wandererDescriptor: '渐变动效文字，仅用于 footer 的强调',
		},
		elevation: {
			flatNote: '表面默认平贴页面。层次靠细线，不靠抬起。',
			intro: '只有一种轻阴影，用 highlight-soft 着色。无玻璃态，无厚重投影，不演绎层级。',
			title: '层次',
		},
		eyebrow: '设计系统',
		flipMascot: '翻转吉祥物',
		northStar: {
			characteristics: [
				'墨色主调 + 单一强调色（静谧玫瑰 / 暖杏）',
				'细线优于填色',
				'三语排版（中 / 英 / 日）',
				'入场渐显，420ms ease-out-quart',
				'单栏窄版（最大 42rem）',
			],
			tagline: '工程精度裹着一层柔光。强调色是声音；稀少才是重点。',
			title: '可爱又闪亮地优雅',
		},
		pageDescription: '驱动 xat.sh 的设计系统 —— 字体、色彩 token、层次、组件，以及保持界面一致的规则。',
		pageTitle: '设计系统 - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text 与 highlight-soft 合计不超过屏幕约 10%。',
					name: '单一声音规则',
				},
				{
					body: '亮色模式下 surface、card、popover 与 background 合一，用边框而非填色区分。',
					name: '细线而非墙规则',
				},
				{
					body: 'font-fugaz-one 仅可用于字面文本「Xat」。',
					name: '单一字标规则',
				},
				{
					body: 'background-clip: text 渐变仅出现在页脚 wanderer 一行。',
					name: '单一渐变规则',
				},
				{
					body: '代码块在亮 / 暗站点模式下均保持 Vesper 深色。',
					name: '代码恒暗规则',
				},
			],
			title: '命名规则',
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
