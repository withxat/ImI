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
				{
					description: '🍊 一个温暖、简洁的 Astro 博客模板',
					title: 'Mikan',
				},
				{
					description: '🫧 我的个人网站和数字花园',
					title: 'ImI',
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
					description: '文字与图标。',
					title: '内容',
				},
				highlight: {
					description: '浅色模式是静谧玫瑰，深色模式换成暖杏：纯玫瑰色放在深墨底上会发闷。两者加起来不超过单屏的 10%。',
					title: '高亮',
				},
				status: {
					description: '留给提示框和错误状态。目前站上还用不到它们。',
					title: '状态',
				},
				surface: {
					description: '页面，以及放在它上面的东西。',
					title: '表面',
				},
				washEdges: {
					description: '悬停底色、行内代码，以及封闭表面的细线边框。',
					title: '底色与边界',
				},
			},
			modeLabel: {
				dark: '深色',
				light: '浅色',
			},
			roles: {
				accent: '卡片悬停底色',
				background: '页面',
				border: '细线：卡片、表格、分隔线',
				card: 'bejamas 卡片',
				destructive: '错误、破坏性操作',
				foreground: '标题与正文',
				highlightIcon: '可交互图标着色',
				highlightSoft: '链接下划线、悬停光晕',
				highlightText: '字标、强调、链接悬停',
				info: '普通提示',
				muted: '提示框、行内代码',
				mutedForeground: '描述、元信息、说明文字',
				popover: '弹层、首页链接卡片',
				primary: '实心按钮、页脚图标',
				success: '确认',
				surface: '表格表头',
				warning: '注意',
			},
			tablistLabel: '色板模式',
			title: '色彩',
		},
		components: {
			cardDescription: 'Astro 原生组件库。',
			cardTitle: 'bejamas/ui',
			intro: '基础组件来自 bejamas/ui，保持原样不改，方便随时重新拉取；站点特有的需求一律在外面包一层。',
			particlesIntro: '现成的都不太对味，于是自己做了。',
			particlesTitle: 'Particles',
			primeIntro: '按钮、徽章、弹层、对话框。',
			primeTitle: 'Prime',
			statDigitsDescriptor: '页脚访问量用的金属质感转盘数字',
			textLinkDescriptor: '用渐变画出的下划线：0.1em 粗、圆头，跨行也不断',
			title: '组件',
			wandererDescriptor: '全站唯一的渐变文字：在页脚从玫瑰色流向青色，按国家和你打招呼',
		},
		elevation: {
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: '卡片、介绍徽章、弹层、提示框',
			imageEdgeDescription: '1px 墨色描边 + shadow-halo，不占布局空间',
			imageEdgeLabel: '文章里的截图与插图',
			intro: '表面平贴页面，边缘由细线画出。唯一的阴影是可点击元素下 1–2px 的玫瑰色微光。浅色模式不用纯黑阴影；深色模式改用 35–40% 的黑，因为着色阴影在墨色底上会被吃掉。',
			title: '层次',
		},
		eyebrow: '设计系统',
		flipMascot: '翻转吉祥物',
		northStar: {
			tagline: '可爱，是上面那枚能翻面的硬币，和用 Fugaz One 写的「Xat」。闪亮，是可点击元素下那一圈淡淡的玫瑰色光晕。优雅，是三种文字各自按自己的排版传统断行。',
			title: '可爱、闪亮，也优雅',
		},
		pageDescription: 'xat.sh 的视觉构成：字体、色彩 token、层次、组件，以及它守着的几条规矩。',
		pageTitle: '设计系统 - Xat',
		principles: {
			rules: [
				{
					body: '代码块在两种主题下都用 Vesper 的深色底。语法配色是为这块底调的，所以主题切换止步于代码块边框。',
					name: '代码永远是深色',
				},
				{
					body: '浅色模式下，选中文字是淡淡的蜂蜜色而不是玫瑰色，读到一半选中一句话，也不会被误认成链接。',
					name: '选中不是链接',
				},
				{
					body: '它出现在这里没什么道理，只是因为好玩，所以只给它三个字母。',
					name: 'Fugaz One 只写「Xat」',
				},
			],
			title: '几条规矩',
		},
		typography: {
			intro: '拉丁字母用 Hanken Grotesk，中文和日文用 MiSans。MiSans 被切成若干静态字重，每一档都调到与同一 font-weight 的 Hanken 视觉一致，所以任何元素都不写 font-variation-settings：一旦覆盖，就绕过了这条字重曲线。',
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
				wordmark: { role: '字标', spec: 'Fugaz One · 24–30px · 400' },
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
