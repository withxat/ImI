'use client'

import type { Locale } from '@/lib/i18n/constants'

import { useRouter } from 'waku'

import { LOCALES } from '@/lib/i18n/constants'
import { persistLocale } from '@/lib/i18n/persist-locale'

const LOCALE_LABEL: Record<Locale, string> = {
	en: 'EN',
	ja: '日本語',
	zh: '中文',
}

interface LocaleSwitcherProps {
	'aria-label': string
	'className'?: string
	'currentLocale': Locale
}

export function LocaleSwitcher({ 'aria-label': ariaLabel, className, currentLocale }: LocaleSwitcherProps) {
	const router = useRouter()

	return (
		<div
			aria-label={ariaLabel}
			className={className}
			role="navigation"
		>
			<p className="font-ui text-sm text-muted-foreground">
				{LOCALES.map((locale, index) => (
					<span key={locale}>
						{index > 0 && <span className="mx-1.5 text-border">·</span>}
						{locale === currentLocale
							? (
									<span className="font-medium text-foreground" lang={locale}>
										{LOCALE_LABEL[locale]}
									</span>
								)
							: (
									<button
										className="
											text-link cursor-pointer border-none bg-transparent p-0 font-[inherit] text-muted-foreground
											hover:text-foreground
										"
										onClick={() => {
											persistLocale(locale)
											void router.reload()
										}}
										lang={locale}
										type="button"
									>
										{LOCALE_LABEL[locale]}
									</button>
								)}
					</span>
				))}
			</p>
		</div>
	)
}
