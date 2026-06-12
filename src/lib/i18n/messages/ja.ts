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
			emptyState: {
				description: '帰属が明確なものだけを載せます。',
				title: '公開事例はまだ',
			},
			items: [],
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
			items: [
				{
					description: '🤗 コピーしても Unicode のままの Fluent emoji',
					title: 'rehype-fluent-emoji',
				},
			],
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
			intro: 'ワイドではパレットを並べて表示、ナローではタブで切り替える。既定値は現在のテーマに揃う。',
			modeLabel: {
				dark: 'ダーク',
				light: 'ライト',
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
			tablistLabel: 'パレットモード',
			title: 'カラー',
		},
		components: {
			cardDescription: 'Astro ネイティブのコンポーネント。コピーして自分のものに。',
			cardTitle: 'bejamas/ui',
			intro: '二層構成：そのまま取り込んだプリミティブと、その上に組んだ小さなコンポーネント。',
			particlesIntro: 'Prime の上に重ねる薄い層。このサイトの声を担うプロジェクト固有のパーツ。',
			particlesTitle: 'Particles',
			primeIntro: 'ボタン、バッジ、ポップオーバー、ダイアログ。bejamas/ui からそのままコピーし、触らない。',
			primeTitle: 'Prime',
			statDigitsDescriptor: 'footer のライブ統計に使う金属調のオドメーター数字',
			textLinkDescriptor: '丸みのあるカプセル下線（text-decoration ではない）',
			title: 'コンポーネント',
			wandererDescriptor: 'グラデーションのアニメーションテキスト、footer の強調のみ',
		},
		elevation: {
			flatNote: '面は静止時フラット。深さはヘアラインで、持ち上げではない。',
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: 'インタラクティブ面のシグネチャ halo',
			imageEdgeDescription: '1px インクエッジ · shadow-halo',
			imageEdgeLabel: '記事メディアのエッジ',
			intro: 'ささやかな影を highlight-soft で染める。グラスなし、ドロップシャドウなし、エレベーション演出なし。',
			title: 'エレベーション',
		},
		eyebrow: 'デザインシステム',
		flipMascot: 'マスコットを反転',
		northStar: {
			characteristics: [
				'モノインク + 単一アクセント（Quiet Rose / Warm Apricot）',
				'塗りよりヘアライン',
				'三言語タイポ（en / zh / ja）',
				'入場リビール、420ms ease-out-quart',
				'単一カラム狭幅（最大 42rem）',
			],
			tagline: 'エンジニアリングの精度に、柔らかな光を纏わせる。アクセントは声 — 希少さが効く。',
			title: 'Cute with Shiny Elegance',
		},
		pageDescription: 'xat.sh を支えるデザインシステム — タイポグラフィ、カラートークン、エレベーション、コンポーネント、表面の一貫性を保つルール。',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'highlight-text と highlight-soft の合計は画面の約 10% 以下。',
					name: 'The One Voice Rule',
				},
				{
					body: 'ライトモードでは surface / card / popover は background に揃う。塗りではなくボーダーで分ける。',
					name: 'The Hairlines-Not-Walls Rule',
				},
				{
					body: 'font-fugaz-one は文字列「Xat」以外では禁止。',
					name: 'The One Wordmark Rule',
				},
				{
					body: 'background-clip: text のグラデーションはフッターの wanderer 行のみ。',
					name: 'The One Gradient Rule',
				},
				{
					body: 'コードブロックはライト / ダークどちらのサイトモードでも Vesper ダークのまま。',
					name: 'The Code Stays Dark Rule',
				},
			],
			title: '命名ルール',
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
		connect: 'こちらからどうぞ：',
		moeIcp: '萌えICP登録済み♡ 20264698号',
		stats: {
			afterOnline: '人が滞在中',
			afterTotal: '回見られました',
			beforeOnline: 'いま',
			beforeTotal: '',
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
