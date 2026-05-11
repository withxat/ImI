import type { ReactNode } from 'react'

import { BottomFade } from '@/components/fades'
import { Footer } from '@/components/footer'
import { LocaleBootstrap } from '@/components/locale-bootstrap'
import { RouteTransition } from '@/components/route-transition'
import { htmlLangFor } from '@/lib/i18n/constants'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { RSS_FEED_URL, RSS_TITLE } from '@/lib/rss'

import '@/styles/globals.css'

interface RootLayoutProps { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const locale = getRequestLocale()

	return (
		<div className="relative isolate min-h-screen" lang={htmlLangFor(locale)}>
			<link href={RSS_FEED_URL} rel="alternate" title={RSS_TITLE} type="application/rss+xml" />
			<link href="/favicon.ico" rel="icon" sizes="32x32" />
			<link href="/icon.svg" rel="icon" type="image/svg+xml" />
			<link href="/apple-touch-icon.png" rel="apple-touch-icon" />
			<LocaleBootstrap serverLocale={locale} />
			<main className="min-h-screen">
				<RouteTransition>{children}</RouteTransition>
			</main>
			<Footer locale={locale} />
			<BottomFade />
		</div>
	)
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
