import type { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { LocaleBootstrap } from '@/components/locale-bootstrap'
import { MiSansFontStyles } from '@/components/mi-sans-font'
import { RouteTransition } from '@/components/route-transition'
import { getMessages } from '@/lib/i18n/messages'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { RSS_FEED_URL, RSS_FEED_URL_EN, RSS_FEED_URL_JA } from '@/lib/rss'

import '@/styles/globals.css'

interface RootLayoutProps { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const locale = getRequestLocale()
	const rssZh = getMessages('zh').blog
	const rssEn = getMessages('en').blog
	const rssJa = getMessages('ja').blog

	return (
		<div className="relative isolate min-h-screen">
			<meta charSet="utf-8" />
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<link crossOrigin="anonymous" href="https://avatars.githubusercontent.com" rel="preconnect" />
			{locale === 'zh' ? <MiSansFontStyles /> : null}
			<link href={RSS_FEED_URL} hrefLang="zh-Hans" rel="alternate" title={rssZh.pageTitle} type="application/rss+xml" />
			<link href={RSS_FEED_URL_EN} hrefLang="en" rel="alternate" title={rssEn.pageTitle} type="application/rss+xml" />
			<link href={RSS_FEED_URL_JA} hrefLang="ja" rel="alternate" title={rssJa.pageTitle} type="application/rss+xml" />
			<link href="/favicon.ico" rel="icon" sizes="32x32" />
			<link href="/icon.svg" rel="icon" type="image/svg+xml" />
			<link href="/apple-touch-icon.png" rel="apple-touch-icon" />
			<LocaleBootstrap serverLocale={locale} />
			<main className="min-h-screen">
				<RouteTransition>{children}</RouteTransition>
			</main>
			<Footer locale={locale} />
		</div>
	)
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
