import type { Locale } from '@/lib/i18n/constants'

export type IntroBadgeKind = 'products' | 'systems'

const labels: Record<Locale, Record<IntroBadgeKind, string>> = {
	en: { products: 'AI products', systems: 'systems background' },
	ja: { products: 'AI プロダクト', systems: 'システム工学の背景' },
	zh: { products: 'AI 产品', systems: '系统工程背景' },
}

export function getIntroBadgeLabel(locale: Locale, kind: IntroBadgeKind): string {
	return labels[locale][kind]
}
