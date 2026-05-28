export const LOCALES = ['en', 'zh', 'ja'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Cookie for the UI locale (`en` | `zh` | `ja`). */
export const LOCALE_COOKIE_NAME = 'imi_locale'

/** Map legacy stored tags to the current set (e.g. older `jp` cookie → `ja`). */
export function normalizeStoredLocale(value: string): string {
	if (value === 'jp') {
		return 'ja'
	}
	return value
}

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value)
}

/** Pass-through tag for `Intl` (same primary subtags the site uses). */
export function intlLocaleFor(locale: Locale): string {
	return locale
}

/** `lang` attribute on the document shell. */
export function htmlLangFor(locale: Locale): string {
	return locale
}

/** Open Graph locale follows the site's primary locale keys. */
export function ogLocaleFor(locale: Locale): string {
	return locale
}
