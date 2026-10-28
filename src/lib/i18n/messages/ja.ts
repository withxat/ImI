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
					description: '文字とアイコン。',
					title: 'コンテンツ',
				},
				highlight: {
					description: 'ライトでは Quiet Rose、ダークでは Warm Apricot。ローズのままだと深いインクの上で濁るから。二つ合わせて一画面の 10% 以内。',
					title: 'ハイライト',
				},
				status: {
					description: 'コールアウトとエラー表示のための色。いまのところサイトでは出番がない。',
					title: 'ステータス',
				},
				surface: {
					description: 'ページと、その上に置かれるもの。',
					title: 'サーフェス',
				},
				washEdges: {
					description: 'ホバーの塗り、インラインコード、囲われた面の細い境界線。',
					title: '背景色と境界',
				},
			},
			modeLabel: {
				dark: 'ダーク',
				light: 'ライト',
			},
			roles: {
				accent: 'カードのホバー塗り',
				background: 'ページ',
				border: '細線：カード、表、区切り線',
				card: 'bejamas のカード',
				destructive: 'エラー、破壊的操作',
				foreground: '見出しと本文',
				highlightIcon: '操作できるアイコンの色',
				highlightSoft: 'リンクの下線、ホバーの光',
				highlightText: 'ワードマーク、強調、リンクのホバー',
				info: '通常のお知らせ',
				muted: 'コールアウト、インラインコード',
				mutedForeground: '説明、メタ情報、キャプション',
				popover: 'ポップオーバー、ホームのリンクカード',
				primary: '塗りボタン、フッターのアイコン',
				success: '確認',
				surface: '表のヘッダー',
				warning: '注意',
			},
			tablistLabel: 'パレットモード',
			title: 'カラー',
		},
		components: {
			cardDescription: 'Astro ネイティブのコンポーネントライブラリ。',
			cardTitle: 'bejamas/ui',
			intro: 'プリミティブは bejamas/ui から取り込み、再取得できるよう手を加えない。サイト固有の要件は外側でラップする。',
			particlesIntro: '既製品ではしっくりこなかったので、ここで作ったもの。',
			particlesTitle: 'Particles',
			primeIntro: 'ボタン、バッジ、ポップオーバー、ダイアログ。',
			primeTitle: 'Prime',
			statDigitsDescriptor: 'フッターの訪問数に使う、金属質のオドメーター数字',
			textLinkDescriptor: 'グラデーションで描いた下線。太さ 0.1em、両端は丸く、折り返しても途切れない',
			title: 'コンポーネント',
			wandererDescriptor: 'サイトで唯一のグラデーション文字。フッターでローズからシアンへ流れ、国ごとに挨拶する',
		},
		elevation: {
			haloDescription: '0 1px 2px · highlight-soft / 30%',
			haloLabel: 'カード、紹介バッジ、ポップオーバー、コールアウト',
			imageEdgeDescription: '1px のインクの縁 + shadow-halo、レイアウトに影響しない',
			imageEdgeLabel: '記事内のスクリーンショットとイラスト',
			intro: '面はページにフラットに置き、縁は細線で描く。影はひとつだけ、クリックできるものの下に出る 1–2px のローズの淡い光。ライトモードでは真っ黒な影を使わない。ダークモードでは黒 35–40% に切り替える。色付きの影はインクの上で消えてしまうから。',
			title: 'エレベーション',
		},
		eyebrow: 'デザインシステム',
		flipMascot: 'マスコットを反転',
		northStar: {
			tagline: 'かわいさは、上で裏返せるコインと、Fugaz One で書いた「Xat」。きらめきは、クリックできるものの下にうっすら出るローズの光。上品さは、三つの文字がそれぞれの組版の伝統どおりに改行されること。',
			title: 'かわいく、きらめいて、上品に',
		},
		pageDescription: 'xat.sh の見た目の成り立ち。タイポグラフィ、カラートークン、エレベーション、コンポーネント、そして守っているいくつかのルール。',
		pageTitle: 'Design System - Xat',
		principles: {
			rules: [
				{
					body: 'コードブロックはどちらのテーマでも Vesper の暗いキャンバスのまま。シンタックスの配色はこの背景に合わせてあるので、テーマ切り替えはコードブロックの枠で止まる。',
					name: 'コードはいつもダーク',
				},
				{
					body: 'ライトモードでは、選択したテキストはローズではなく淡いハニー色になる。読みながら一文を選んでも、リンクには見えない。',
					name: '選択はリンクではない',
				},
				{
					body: 'ここにある理由は特にない。ただ楽しいから。なので三文字だけ。',
					name: 'Fugaz One は「Xat」だけ',
				},
			],
			title: 'ハウスルール',
		},
		typography: {
			intro: 'ラテン文字は Hanken Grotesk、中国語と日本語は MiSans。MiSans は静的なウェイトに切り出してあり、各段階が同じ font-weight の Hanken と見た目で揃うよう調整してある。だから要素に font-variation-settings は書かない。書けばその曲線を飛び越えてしまう。',
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
				wordmark: { role: 'Wordmark', spec: 'Fugaz One · 24–30px · 400' },
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
