import type { Locale } from '@/lib/i18n/constants'

import { isLocale, normalizeStoredLocale } from '@/lib/i18n/constants'

/** Query param used once per navigation to persist locale via middleware (not a locale URL prefix). */
export const LOCALE_SWITCH_PARAM = 'set_locale'

export function parseLocaleSwitchParam(value: null | string): Locale | null {
	if (!value)
		return null
	const normalized = normalizeStoredLocale(value.trim())
	if (!isLocale(normalized))
		return null
	return normalized
}

/** Same path + existing query/hash, swapping the locale cookie via middleware redirect. */
export function buildLocaleSwitchHref(pathname: string, search: string, target: Locale): string {
	const params = new URLSearchParams(search.replace(/^\?/, ''))
	params.delete(LOCALE_SWITCH_PARAM)
	params.set(LOCALE_SWITCH_PARAM, target)
	const qs = params.toString()
	return qs ? `${pathname}?${qs}` : `${pathname}?${LOCALE_SWITCH_PARAM}=${target}`
}
