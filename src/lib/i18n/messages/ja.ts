import type { Messages } from '@/lib/i18n/messages/types'

import { codeBlockByLocale } from '@/lib/i18n/code-block-copy.ts'

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
	codeBlock: codeBlockByLocale.ja,
	design: {
		colors: {
			groups: {
				content: {
					description: 'テキストとアイコンの前景色。',
					title: 'コンテンツ',
				},
				highlight: {
					description: 'ブランドの声。アイデンティティ、強調、リンクの示唆に控えめに使う。',
					title: 'ハイライト',
				},
				status: {
					description: 'セマンティックなフィードバック。装飾ではなく意図で使う。',
					title: 'ステータス',
				},
				surface: {
					description: 'ページのキャンバス、せり上がったパネル、オーバーレイ。ダークでは層が段差を持ち、ライトでは白に揃え、塗りではなくボーダーで分ける。',
					title: 'サーフェス',
				},
				washEdges: {
					description: 'ホバー / 選択ステートの薄塗りと、構造を支える細線。',
					title: 'ウォッシュとエッジ',
				},
			},
			intro: {
				after: ' クラスで描画されるため、別モードでプレビューしてもソースに忠実な値を保ちます。',
				before: 'トークンは ',
				middle1: ' に定義されています。両パレットはスコープ付きの ',
				middle2: ' / ',
			},
			roles: {
				accent: 'インタラクティブウォッシュ（hover、pressed）',
				background: 'ページキャンバス',
				border: 'ヘアラインの区切り',
				card: 'カードの塗り（surface のエイリアス）',
				destructive: 'エラー、破壊的操作',
				foreground: '主要なインク',
				highlightIcon: 'ブランドのアイコン色',
				highlightSoft: 'ブランドの薄塗り',
				highlightText: 'ブランドの文字色',
				info: '情報',
				muted: '静的ウォッシュ',
				mutedForeground: '副次的なインク',
				popover: 'フローティング層（ポップオーバー、メニュー）',
				primary: '主アクションの塗り（モノインク）',
				success: '確認、ポジティブ',
				surface: 'インラインサーフェス（カード、パネル）',
				warning: '注意',
			},
			title: 'カラー',
		},
		eyebrow: 'デザインシステム',
		flipMascot: 'マスコットを反転',
		pageDescription: 'xat.sh を支えるデザインシステム — タイポグラフィ、カラートークン、そして表面の一貫性を保つルール。',
		pageTitle: 'Design System - Xat',
		typography: {
			sampleDescriptors: {
				accent: 'アクセント',
				cjk: 'CJK',
				display: 'Display & UI',
				mono: '等幅',
				serif: 'セリフ',
			},
			title: 'タイポグラフィ',
		},
	},
	footer: {
		connect: 'こちらからどうぞ：',
		moeIcp: '萌えICP登録済み♡ 20264698号',
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
		capabilitiesIntro: 'プロダクトの表面、フロントエンド基盤、開発者向けツール、そのあいだにある小さな操作感を行き来している。',
		emptyCapabilityDescription: '見せられるものができたらリンクを載せます。',
		emptyCapabilityTitle: '作業中',
		introAfterProducts: 'を形にする。',
		introBeforeSystems: '',
		introBetweenBadges: 'という背景から、設計意図・実装制約・現場の複雑さのバランスを学び、',
		metaDescription:
			'デザインエンジニア。AI ネイティブなプロダクトとフロントエンドをつくる。フロントエンド、デザインシステム、ツールのメモ。',
		notFound: {
			description: 'お探しのページは存在しないか、移動しました。',
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
