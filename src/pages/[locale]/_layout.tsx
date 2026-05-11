import type { ReactNode } from 'react'

import type { Locale } from '@/lib/i18n/constants'

import { Footer } from '@/components/footer'
import { htmlLangFor, isLocale } from '@/lib/i18n/constants'

interface LocaleLayoutProps {
	children: ReactNode
	locale: string
}

export default async function LocaleLayout({ children, locale }: LocaleLayoutProps) {
	if (!isLocale(locale)) {
		throw new Error(`Invalid locale: ${locale}`)
	}

	const safeLocale: Locale = locale

	return (
		<div lang={htmlLangFor(safeLocale)}>
			{children}
			<Footer locale={safeLocale} />
		</div>
	)
}

export async function getConfig() {
	return {
		render: 'static',
		staticPaths: ['en', 'jp', 'zh'],
	} as const
}
