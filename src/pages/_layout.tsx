import type { ReactNode } from 'react'

import { Footer } from '../components/footer'
import { Header } from '../components/header'

import '../styles/globals.css'

interface RootLayoutProps { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const data = await getData()

	return (
		<div className="min-h-screen font-['Manrope',sans-serif]">
			<meta content={data.description} name="description" />
			<link href="/favicon.ico" rel="icon" sizes="32x32" />
			<link href="/icon.svg" rel="icon" type="image/svg+xml" />
			<link href="/apple-touch-icon.png" rel="apple-touch-icon" />
			<Header />
			<main className="min-h-screen">
				{children}
			</main>
			<Footer />
		</div>
	)
}

async function getData() {
	const data = {
		description: 'A simple responsive page built with Waku and Tailwind.',
		icon: '/images/favicon.png',
	}

	return data
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
