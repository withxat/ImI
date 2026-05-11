'use client'

import type { Locale } from '@/lib/i18n/constants'

import { useRouter } from 'waku'

import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY, LOCALES } from '@/lib/i18n/constants'

const LOCALE_LABEL: Record<Locale, string> = {
	en: 'EN',
	jp: 'JP',
	zh: '中文',
}

function persistLocale(locale: Locale) {
	try {
		localStorage.setItem(LOCALE_STORAGE_KEY, locale)
	}
	catch {
		// ignore
	}
	document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
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
									<span className="font-medium text-foreground" lang={locale === 'jp' ? 'ja' : locale}>
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
										lang={locale === 'jp' ? 'ja' : locale}
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
