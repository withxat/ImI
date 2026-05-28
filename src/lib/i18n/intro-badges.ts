import type { Locale } from '@/lib/i18n/constants'

export type IntroBadgeKind = 'products' | 'systems'

const labels: Record<Locale, Record<IntroBadgeKind, string>> = {
	en: { products: 'intelligent products', systems: 'systems background' },
	ja: { products: 'インテリジェントプロダクト', systems: 'システムのバックグラウンド' },
	zh: { products: '智能产品', systems: '系统工程背景' },
}

export function getIntroBadgeLabel(locale: Locale, kind: IntroBadgeKind): string {
	return labels[locale][kind]
}
