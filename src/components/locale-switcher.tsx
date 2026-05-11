'use client'

import type { Locale } from '@/lib/i18n/constants'

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
											/* Waku's router.reload() only refetches the current route; prefetched RSC for
											 * other paths can stay in __WAKU_PREFETCHED__ with the old locale. Hard reload
											 * clears that cache so navigation uses the new cookie site-wide. */
											window.location.reload()
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
