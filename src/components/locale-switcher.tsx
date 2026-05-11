'use client'

import type { Locale } from '@/lib/i18n/constants'

import { Link, useRouter } from 'waku'

import { LOCALES } from '@/lib/i18n/constants'
import { swapLocaleInPath } from '@/lib/i18n/paths'

const LOCALE_LABEL: Record<Locale, string> = {
	en: 'EN',
	jp: 'JP',
	zh: '中文',
}

interface LocaleSwitcherProps {
	'aria-label': string
	'className'?: string
}

export function LocaleSwitcher({ 'aria-label': ariaLabel, className }: LocaleSwitcherProps) {
	const { path } = useRouter()

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
						<Link
							className="
								text-link text-muted-foreground
								hover:text-foreground
							"
							hrefLang={locale === 'jp' ? 'ja' : locale === 'zh' ? 'zh-Hans' : 'en'}
							lang={locale === 'jp' ? 'ja' : locale}
							to={swapLocaleInPath(path, locale)}
						>
							{LOCALE_LABEL[locale]}
						</Link>
					</span>
				))}
			</p>
		</div>
	)
}
