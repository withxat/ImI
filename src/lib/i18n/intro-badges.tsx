import type { ReactNode } from 'react'

import type { Locale } from '@/lib/i18n/constants'

export type IntroBadgeKind = 'products' | 'systems'

export interface IntroBadgeCopy {
	description: ReactNode
	label: string
}

const introBadgesEn: Record<IntroBadgeKind, IntroBadgeCopy> = {
	products: {
		description: (
			<>
				Today I work at
				{' '}
				<a
					className="text-link"
					href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
					rel="noreferrer"
					target="_blank"
				>
					Central China Normal University
				</a>
				{' '}
				on production AI products and intelligent experiences—exploring how models reshape interfaces, collaboration, and tools.
			</>
		),
		label: 'intelligent products',
	},
	systems: {
		description: (
			<>
				My background is in
				{' '}
				<i>Intelligent Transportation Systems</i>
				: software and design where physical infrastructure meets digital systems.
			</>
		),
		label: 'systems background',
	},
}

const introBadgesZh: Record<IntroBadgeKind, IntroBadgeCopy> = {
	products: {
		description: (
			<>
				目前在
				{' '}
				<a
					className="text-link"
					href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
					rel="noreferrer"
					target="_blank"
				>
					华中师范大学
				</a>
				{' '}
				参与生产级 AI 产品与智能体验，探索模型如何重塑界面、协作与工具。
			</>
		),
		label: '智能产品',
	},
	systems: {
		description: (
			<>
				我的专业背景是
				{' '}
				<i>智能交通系统</i>
				：让实体基础设施与数字系统相遇的软件与设计。
			</>
		),
		label: '系统工程背景',
	},
}

const introBadgesJa: Record<IntroBadgeKind, IntroBadgeCopy> = {
	products: {
		description: (
			<>
				現在は
				{' '}
				<a
					className="text-link"
					href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
					rel="noreferrer"
					target="_blank"
				>
					華中師範大学
				</a>
				{' '}
				で本番向け AI プロダクトとインテリジェント体験に取り組み、モデルがインターフェース・協業・ツールをどう変えるかを探っています。
			</>
		),
		label: 'インテリジェントプロダクト',
	},
	systems: {
		description: (
			<>
				背景は
				{' '}
				<i>インテリジェント交通システム</i>
				。物理インフラとデジタルが交差するソフトウェアとデザインです。
			</>
		),
		label: 'システムのバックグラウンド',
	},
}

const byLocale: Record<Locale, Record<IntroBadgeKind, IntroBadgeCopy>> = {
	en: introBadgesEn,
	ja: introBadgesJa,
	zh: introBadgesZh,
}

export function getIntroBadgeCopy(locale: Locale, kind: IntroBadgeKind): IntroBadgeCopy {
	return byLocale[locale][kind]
}
