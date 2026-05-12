import type { ReactNode } from 'react'

import { htmlLangFor } from '@/lib/i18n/constants'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { getThemeBootstrapScript } from '@/lib/theme/constants'

interface RootElementProps {
	children: ReactNode
}

export default async function RootElement({ children }: RootElementProps) {
	const locale = getRequestLocale()

	return (
		<html lang={htmlLangFor(locale)} suppressHydrationWarning>
			<head>
				{/* eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- intentional inline FOUC blocker */}
				<script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
			</head>
			<body>{children}</body>
		</html>
	)
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
