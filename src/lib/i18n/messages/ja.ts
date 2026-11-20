import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

const ja: Messages = {
	blog: {
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
			items: [],
			title: 'AI 体験',
		},
		{
			items: [
				{
					description: '🍤 TypeScript Monorepo テンプレート',
					title: 'Monorepo-Template',
				},
			],
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
			title: '開発ツールチェーン',
		},
		{
			items: [
				{
					description: '😀 Unicode Emoji を Fluent Emoji として描画する Rehype プラグイン',
					title: 'Rehype-Fluent-Emoji',
				},
				{
					description: '🍊 あたたかくてミニマルな Astro ブログテンプレート',
					title: 'Mikan',
				},
				{
					description: '🫧 個人サイト兼デジタルガーデン',
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
		pageDescription: 'xat.sh を支えるデザインシステム。タイポグラフィ、カラートークン、三言語の組版、レイヤー、モーション。',
		pageTitle: 'Design System - Xat',
		typography: {
			families: {
				callingCode: 'コード・等幅',
				fugazOne: '「Xat」のみ',
				hankenGrotesk: '欧文',
				miSans: '日中文字 · wght 330/415/500 を Hanken に調整',
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
		},
		wrapping: {
			rulesOff: ':lang() ルール：オフ',
			rulesOn: ':lang() ルール：オン',
			title: '三言語の折り返し',
			widthLabel: '行幅',
		},
	},
	footer: {
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
		playName: '名前の発音を再生',
		projectsEyebrow: 'つくったもの',
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
