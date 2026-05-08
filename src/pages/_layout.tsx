import type { ReactNode } from 'react'

import { Footer } from '../components/footer'
import { Header } from '../components/header'

import '../styles.css'

interface RootLayoutProps { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const data = await getData()

	return (
		<div className="min-h-screen font-['Manrope',_sans-serif]">
			<meta content={data.description} name="description" />
			<link href={data.icon} rel="icon" type="image/png" />
			<link href="https://fonts.googleapis.com" rel="preconnect" />
			<link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
			<link
				href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
				precedence="font"
				rel="stylesheet"
			/>
			<Header />
			<main className="min-h-[calc(100vh-121px)]">
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
