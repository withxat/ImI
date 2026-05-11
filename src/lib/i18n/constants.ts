export const LOCALES = ['en', 'zh', 'jp'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Cookie and localStorage key for the UI locale override (en | zh | jp). */
export const LOCALE_COOKIE_NAME = 'imi_locale'

export const LOCALE_STORAGE_KEY = 'imi_locale'

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value)
}

/** BCP 47 for Intl; site uses `jp` as the internal locale code for Japanese. */
export function intlLocaleFor(locale: Locale): string {
	if (locale === 'zh')
		return 'zh-CN'
	if (locale === 'jp')
		return 'ja-JP'
	return 'en-US'
}

/** `lang` attribute value for document fragments. */
export function htmlLangFor(locale: Locale): string {
	if (locale === 'zh')
		return 'zh-Hans'
	if (locale === 'jp')
		return 'ja'
	return 'en'
}
