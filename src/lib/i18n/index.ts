export type { Locale } from '@/lib/i18n/constants'
export {
	DEFAULT_LOCALE,
	htmlLangFor,
	intlLocaleFor,
	isLocale,
	LOCALE_COOKIE_NAME,
	LOCALE_STORAGE_KEY,
	LOCALES,
	normalizeStoredLocale,
} from '@/lib/i18n/constants'
export { getIntroBadgeCopy } from '@/lib/i18n/intro-badges'
export type { IntroBadgeKind } from '@/lib/i18n/intro-badges'
export { getMessages, type Messages } from '@/lib/i18n/messages'
export { getRequestLocale, resolveLocaleFromHeaders } from '@/lib/i18n/request-locale'
