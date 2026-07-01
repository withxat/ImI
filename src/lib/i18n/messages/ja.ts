import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const ja: Messages = {
	blog: {
		archiveSubtitle: 'アーカイブ置き場。ゆっくり光り出す言葉もあります。',
		goHome: 'ホームへ',
		pageDescription: 'フロントエンド、デザイン、AI、それから Xat のこまごました記録。',
		pageTitle: 'Xat のアーカイブ置き場',
		postTranslatedNotice: {
			afterLink: 'に切り替えると著者による原文を読めます。',
			beforeLink: 'この記事は中国語の原文をAIが翻訳したものです。サイトの言語を',
			switchToChineseAriaLabel: 'サイトの表示言語を中文に切り替えて原文を表示する',
		},
		title: 'すべての記事',
	},
	capabilities: [
		{
			emptyState: {
				description: '自分で納得できたものだけ載せたい。',
				title: '事例はまだ',
			},
			items: [],
			summary: 'AI を使えるものにして、ちゃんと使いたくなるものにもする。',
			title: 'AI 体験',
		},
		{
			items: [
				{
					description: '🍤 TypeScript Monorepo テンプレート',
					title: 'Monorepo-Template',
				},
			],
			summary: 'アーキテクチャも性能も、長く面倒を見られる形にする。',
			title: 'フロントエンドエンジニアリング',
		},
		{
			items: [
				{
					description: '📒 現代的なプロジェクト向けの厳格な TypeScript 設定',
					title: 'TSConfig',
				},
				{
					description: '🧃 Xat のこだわり強めな自家用 ESLint 設定',
					title: 'ESLint-Config',
				},
			],
			summary: '設定とワークフローをいじって、同じ穴には二度落ちない。',
			title: '開発ツールチェーン',
		},
		{
			items: [
				{
					description: '😀 Unicode Emoji を Fluent Emoji として描画する Rehype プラグイン',
					title: 'rehype-fluent-emoji',
				},
			],
			summary: 'モーションと操作の細部を詰めて、触りやすく、見た目も気持ちいい画面にする。',
			title: 'インターフェースとインタラクション',
		},
	],
	categories: {
		design: {
			description: '美意識を満たすためのこだわり',
			name: 'デザイン',
		},
		life: {
			description: '日常の泡みたいな話',
			name: '生活',
		},
		tech: {
			description: '開発まわりの雑感',
			name: 'テック',
		},
	},
	codeBlock: codeBlockByLocale.ja,
	design: {
		colors: {
			groups: {
				content: {
					description: '文字とアイコンの基本色。',
					title: 'コンテンツ',
				},
				highlight: {
					description: 'ブランドカラー。強調したいところだけに、控えめに。',
					title: 'ハイライト',
				},
				status: {
					description: '意味のあるフィードバック。飾る前に、まず意図を伝える。',
					title: 'ステータス',
				},
				surface: {
					description: 'ページ本体、パネル、フローティングレイヤー。',
					title: 'サーフェス',
				},
				washEdges: {
					description: '操作状態の淡い背景色と、囲われた面の静かな境界。',
					title: '背景色と境界',
				},
			},
			intro: 'ワイドではパレットを並べて表示、ナローではタブで切り替える。既定値は現在のテーマに揃う。',
			modeLabel: {
				dark: 'ダーク',
				light: 'ライト',
			},
			roles: {
				accent: '操作状態の淡い背景色',
				background: 'ページ背景',
				border: 'ボーダー',
				card: 'カードの塗り',
				destructive: 'エラー、破壊的操作',
				foreground: '主テキスト色',
				highlightIcon: 'ブランドアイコン色',
				highlightSoft: 'ブランドの淡い背景色',
				highlightText: 'ブランドの強調テキスト',
				info: '情報',
				muted: '淡い背景色',
				mutedForeground: '弱いテキスト色',
				popover: 'フローティングレイヤー',
				primary: '主操作の塗り',
				success: '成功、確認',
				surface: 'サーフェス',
				warning: '警告',
			},
			tablistLabel: 'パレットモード',
			title: 'カラー',
		},
		components: {
			cardDescription: 'Astro ネイティブのコンポーネントライブラリ。',
			cardTitle: 'bejamas/ui',
			intro: '二層構成。ひとつは primitive をそのまま保ち、もうひとつはその上にこのサイトらしいコンポーネントを組む。',
			particlesIntro: 'このサイトの空気に馴染む小さなパーツ。',
			particlesTitle: 'Particles',
			primeIntro: 'ボタン、バッジ、ポップオーバー、ダイアログ。すべて bejamas/ui から。',
			primeTitle: 'Prime',
			statDigitsDescriptor: 'フッターのリアルタイム訪問数に使う、金属質のオドメーター数字',
			textLinkDescriptor: '両端が丸いカプセル下線',
			title: 'コンポーネント',
			wandererDescriptor: 'グラデーションで動く文字。フッターの装飾だけに使う。',
		},
		elevation: {
			flatNote: '面はページにフラットに置く。細線は縁を定め、柔らかな光は操作性を示す。',
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: '操作できる面を示す、シグネチャの柔らかな縁',
			imageEdgeDescription: '1px インクエッジ · shadow-halo',
			imageEdgeLabel: '記事メディアのエッジ',
			intro: 'highlight-soft で色づけした薄い影。操作できることを伝える。',
			title: 'エレベーション',
		},
		eyebrow: 'デザインシステム',
		flipMascot: 'マスコットを反転',
		northStar: {
			characteristics: [
				'モノインク基調 + 単一アクセント（Quiet Rose / Warm Apricot）',
				'余白、リズム、タイポグラフィの整列でページを組む',
				'三言語の組版を最適化（zh / en / ja）',
				'入場時のフェード、420ms ease-out-quart',
				'レスポンシブな単一ナローカラム（最大 42rem）',
			],
			tagline: '骨格は精密に、表面は柔らかく。アクセントカラーは必要なときだけ。',
			title: 'かわいく、きらめいて、上品に',
		},
		pageDescription: 'xat.sh を支えるデザインシステム。タイポグラフィ、カラートークン、レイヤー、コンポーネント、一貫性を保つための原則。',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text と highlight-soft は、ひとつの画面の 10% 以下に抑える。',
					name: 'ひとつの声の原則',
				},
				{
					body: '余白、リズム、タイポグラフィの整列でページを組み、細線は必要な面の境界にだけ使う。',
					name: '余白優先のレイアウト原則',
				},
				{
					body: 'font-fugaz-one は「Xat」というロゴ文字にだけ使う。',
					name: 'ひとつのワードマークの原則',
				},
				{
					body: 'background-clip: text のグラデーションはフッターの wanderer 行のみ。',
					name: 'ひとつのグラデーションの原則',
				},
				{
					body: 'コードブロックはライト / ダークどちらのサイトモードでも Vesper ダークのまま。',
					name: 'コードはダークのまま',
				},
			],
			title: 'デザイン原則',
		},
		typography: {
			sampleDescriptors: {
				accent: 'アクセント',
				cjk: 'CJK',
				display: 'Display & UI',
				mono: '等幅',
				serif: 'セリフ',
			},
			scale: {
				bioLead: { role: 'Bio lead', spec: 'Source Han Serif SC · 16px / 28px · 600' },
				body: { role: 'Body', spec: 'Hanken Grotesk + MiSans · 16px / 28px · 400' },
				display: { role: 'Display', spec: 'Hanken Grotesk · 30px · 500' },
				headline: { role: 'Headline', spec: 'Hanken Grotesk · 24px · 500' },
				label: { role: 'Label', spec: 'Hanken Grotesk · 14px · 500' },
				mono: { role: 'Mono', spec: 'Calling Code · 12px · 400' },
				title: { role: 'Title', spec: 'Hanken Grotesk · 18px · 600' },
				wordmark: { role: 'Wordmark', spec: 'Fugaz One · 24–30px · 400 · 「Xat」のみ' },
			},
			scaleTitle: '階層',
			specimensTitle: '見本',
			title: 'タイポグラフィ',
		},
	},
	footer: {
		connect: 'このへんなら捕まります：',
		moeIcp: '萌えICP登録済み♡ 20264698号',
		stats: {
			afterOnline: '人が通りすがり',
			afterTotal: '回のぞかれました',
			beforeOnline: 'いま',
			beforeTotal: 'これまで',
		},
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
		bioLead: 'インターフェースを磨くのも、AI の可能性を探るのも好き。',
		bioP1: 'デザインと技術を組み合わせて、現実の問題を解きたい。',
		capabilitiesEyebrow: 'できること',
		capabilitiesIntro: 'プロダクト、デザイン、エンジニアリングの間にある、小さいけれど大事な細部にいつも惹かれる。',
		emptyCapabilityDescription: '準備ができたら、ここに現れます。',
		emptyCapabilityTitle: '作業中',
		introAfterProducts: 'を形にする。',
		introBeforeSystems: '',
		introBetweenBadges: 'のおかげで、デザイン・実装・本当のニーズの間でバランスを取りながら、',
		metaDescription:
			'AI とフロントエンドを軸に活動するデザインエンジニア。コード、デザイン、AI について書いています。',
		notFound: {
			description: 'ここには何もないみたい。ページは引っ越したのかもしれません。',
			goHome: 'ホームへ戻る',
			title: 'ページが見つかりません',
		},
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

export default ja
