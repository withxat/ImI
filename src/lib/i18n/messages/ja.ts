import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const ja: Messages = {
	blog: {
		goHome: 'ホームへ',
		lightbox: {
			close: '画像を閉じる',
			next: '次の画像',
			prev: '前の画像',
			zoom: '画像を拡大',
		},
		linkCopied: 'リンクをコピーしました',
		moreWriting: 'ほかの記事',
		newer: '次の記事',
		older: '前の記事',
		pageDescription: 'フロントエンド、デザイン、AI、それから Xat のこまごました記録。',
		pageTitle: 'Xat のアーカイブ置き場',
		postCountSuffix: ' 本',
		postTranslatedNotice: {
			afterLink: 'に切り替えてください。',
			beforeLink: 'この記事は中国語の原文をもとに AI が翻訳したものです。原文で読む場合は',
			switchToChineseAriaLabel: 'サイトの表示言語を中文に切り替えて原文を表示する',
		},
		readingTime: (minutes: number) => `約 ${minutes} 分`,
		sectionCount: (count: number) => `全 ${count} 節`,
		title: 'すべての記事',
		toc: '目次',
		viewSource: 'ソースを見る',
	},
	capabilities: [
		{
			items: [],
			title: 'AI 体験',
		},
		{
			items: [
				{
					description: 'TypeScript Monorepo テンプレート',
					title: 'Monorepo-Template',
				},
			],
			title: 'フロントエンドエンジニアリング',
		},
		{
			items: [
				{
					description: '自家用の厳格な TypeScript 設定プリセット',
					title: 'TSConfig',
				},
				{
					description: 'Xat のこだわり強めな自家用 ESLint 設定',
					title: 'ESLint-Config',
				},
			],
			title: '開発ツールチェーン',
		},
		{
			items: [
				{
					description: 'Fluent Emoji で描画し、コピー時は元の Unicode を保持',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: 'このサイトから切り出したシンプルな Astro ブログテンプレート',
					title: 'Mikan',
				},
				{
					description: 'SwiftUI 製の iPhone 向け Cloudflare クライアント。ウィジェット対応',
					title: 'Dash',
				},
				{
					description: '個人サイト',
					title: 'ImI',
				},
			],
			title: 'インターフェースとインタラクション',
		},
	],
	categories: {
		design: {
			name: 'デザイン',
		},
		life: {
			name: '生活',
		},
		tech: {
			name: 'テック',
		},
	},
	codeBlock: codeBlockByLocale.ja,
	design: {
		colors: {
			copied: 'コピー済み',
			copyToken: (name: string) => `CSS 変数 ${name} をコピー`,
			copyValue: (name: string, mode: string) => `${name}（${mode}）の OKLCH 値をコピー`,
			groups: {
				code: 'コード',
				content: '文字',
				highlight: 'アクセント',
				status: 'ステータス',
				surface: '背景・面',
				washEdges: '塗り・境界線',
			},
			modeLabel: {
				dark: 'ダーク',
				light: 'ライト',
			},
			roles: {
				background: 'ページ',
				border: '1px 細線',
				code: 'Vesper 背景',
				codeForeground: 'コード文字',
				foreground: '主文字 · primary',
				highlightBrand: 'ワードマーク · 旅人',
				highlightIcon: 'アイコン色',
				highlightSoft: '下線 · 光彩',
				highlightText: 'リンク · 強調',
				muted: 'ホバー · コード · accent',
				mutedForeground: '補助テキスト',
				selection: '選択範囲',
				status: '予約',
				surface: 'カード · ポップオーバー',
			},
			title: 'カラー',
		},
		eyebrow: 'デザインシステム',
		flipMascot: 'コインを裏返す',
		geometry: {
			haloLabel: 'バッジ・翻訳の注記',
			imageEdgeLabel: '記事の画像',
			radiiTitle: '角丸',
			shadowsTitle: '影',
			title: '角丸と影',
		},
		motion: {
			replay: '再生',
			slow: '0.25×',
			title: 'モーション',
		},
		pageDescription: 'xat.sh のデザインシステム。タイポグラフィ、配色、三言語の組版、角丸と影、モーションまで、実行中の CSS からそのまま表示しています。',
		pageTitle: 'Design System - Xat',
		typography: {
			families: {
				callingCode: 'コード・等幅',
				fugazOne: '「Xat」のみ',
				hankenGrotesk: '欧文',
				miSans: '日中文字',
				sourceHanSerif: 'ホームのリード文',
			},
			scale: {
				bioLead: 'リード文',
				body: '本文',
				display: '大見出し',
				headline: '見出し',
				label: 'ラベル',
				mono: '等幅',
				title: '小見出し',
				wordmark: 'ワードマーク',
			},
			scaleTitle: 'スケール',
			title: 'タイポグラフィ',
			weightsMatchOff: '調整：オフ',
			weightsMatchOn: '調整：オン',
			weightsNote: '同じ font-weight でも MiSans は Hanken より線がひと回り太くなるので、wght は一段ずつ Hanken に合わせて手で調整しています。調整をオフにすると、天秤が傾きます。',
			weightsTitle: 'ウェイト',
		},
		wrapping: {
			rulesOff: ':lang() ルール：オフ',
			rulesOn: ':lang() ルール：オン',
			title: '三言語の折り返し',
			widthLabel: '行幅',
		},
	},
	footer: {
		copyEmail: 'メールアドレスをコピー',
		emailCopied: 'コピーしたよ',
		linksAriaLabel: 'リンク',
		moeIcp: '萌えICP登録済み♡ 20264698号',
		stats: {
			afterOnline: '人が通りすがり',
			afterTotal: '回のぞかれました',
			alone: 'いま通りすがっているのは、あなただけ',
			beforeOnline: 'いま',
			beforeTotal: 'これまで',
		},
	},
	header: {
		breadcrumbAriaLabel: 'パンくずリスト',
		goHome: 'ホームへ',
		home: 'ホーム',
		skipToContent: '本文へ移動',
		theme: {
			ariaLabel: 'テーマ',
			dark: 'ダーク',
			light: 'ライト',
			system: 'システム',
		},
		writing: '記事',
	},
	home: {
		bioLead: 'UI の細部を磨くのも、ちゃんと使いやすい AI ツールを作るのも好き。',
		codingPulse: {
			activeDaysSuffix: '日稼働',
			axisToday: '今日',
			badgeHigh: '高負荷',
			badgePeak: 'ピーク',
			badgeRest: '休日',
			badgeToday: '今日',
			charging: '充電中',
			eyebrow: 'AI コーディング',
			months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			moodActive: '今日も書いてる',
			moodIdle: '今日はお休み',
			other: 'その他',
			overviewLabel: '累計',
			restHeadline: 'AI を開かず、ゆっくり休んだ日',
			restSubAfter: ' 日',
			restSubBefore: '直近 180 日間の休日は ',
			roundsSuffix: ' 回',
			rulerAriaLabel: '直近 180 日間の AI コーディング使用量',
			scopeAll: '累計',
			scopeAriaLabel: '表示範囲',
			scopeToday: '今日',
			weekdays: ['日', '月', '火', '水', '木', '金', '土'],
		},
		introAfterProducts: 'を作っています。',
		introBeforeSystems: '',
		introBetweenBadges: 'から構造で考える癖がついていて、今はフロントエンドと',
		metaDescription:
			'フロントエンドと AI プロダクトを作るデザインエンジニア、Xat の個人サイト。コードや UI、日々のメモを書いています。',
		notFound: {
			description: 'リンクが変わったか、打ち間違いかもしれません。かわりに最近の記事をどうぞ。',
			didYouMean: {
				after: '」？',
				before: 'もしかして「',
			},
			title: 'ここには何もないみたい',
		},
		playName: '名前の発音を再生',
		poke: {
			label: 'Xat をつつく',
			lines: ['やあ', 'なに？', 'くすぐったいよ', 'もう、やめてってば'],
			sulk: 'ふーんだ、もう知らない',
		},
		projectsEyebrow: 'つくったもの',
		role: 'デザインエンジニア',
		spotlight: {
			description: '今見ているこのサイト。Astro 7 と Cloudflare Workers で組み、三言語対応や日中ウェイトの手調整、フォントサブセットまで自作しています。/design の数値はすべて実行中の CSS から取得。',
			source: 'GitHub ソース',
			title: 'このサイトとデザインシステム',
		},
		tagline: 'Xat - デザインエンジニア',
		title: 'Xat - デザインエンジニア',
		toolsShelfLabel: '設定とテンプレート',
		viewAllPosts: 'すべて見る',
		writingEyebrow: '書いたもの',
	},
	localeSwitcher: {
		ariaLabel: '言語',
	},
	resume: {
		pageDescription: 'デザインエンジニア Xat のレジュメ。AI ネイティブなプロダクト、フロントエンド開発、UI の作り込み。',
		pageTitle: 'レジュメ - Xat',
		present: '現在',
		print: '印刷・PDF 保存',
		sections: {
			education: '学歴',
			experience: '職歴',
			openSource: 'オープンソース',
			projects: '個人プロジェクト',
			skills: 'スキル',
		},
		title: 'レジュメ',
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
