export const LOCALES = ['en', 'zh', 'jp'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value)
}

export function toLocale(value: string): Locale {
	if (!isLocale(value)) {
		throw new Error(`Invalid locale: ${value}`)
	}
	return value
}

/** BCP 47 for Intl; URL segment stays `jp` per site convention. */
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
