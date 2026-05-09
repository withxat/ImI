import type { ReactNode } from 'react'

import { BottomFade } from '@/components/fades'
import { Footer } from '@/components/footer'
import { RouteTransition } from '@/components/route-transition'
import { RSS_FEED_URL, RSS_TITLE } from '@/lib/rss'

import '@/styles/globals.css'

interface RootLayoutProps { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const data = await getData()

	return (
		<div className="min-h-screen">
			<meta content={data.description} name="description" />
			<meta content="Hi, Xat!" property="og:title" />
			<meta content={data.description} property="og:description" />
			<meta content="summary_large_image" name="twitter:card" />
			<meta content="Hi, Xat!" name="twitter:title" />
			<link href={RSS_FEED_URL} rel="alternate" title={RSS_TITLE} type="application/rss+xml" />
			<link href="/favicon.ico" rel="icon" sizes="32x32" />
			<link href="/icon.svg" rel="icon" type="image/svg+xml" />
			<link href="/apple-touch-icon.png" rel="apple-touch-icon" />
			<main className="min-h-screen">
				<RouteTransition>{children}</RouteTransition>
			</main>
			<Footer />
			<BottomFade />
		</div>
	)
}

async function getData() {
	const data = {
		description: 'Code with Love, Exploring the World.',
		icon: '/images/favicon.png',
	}

	return data
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
