import type { Locale } from '@/lib/i18n/constants'

import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from '@/lib/i18n/constants'

/** Persists UI locale in `localStorage` and a first-party cookie (browser only). */
export function persistLocale(locale: Locale) {
	if (typeof document === 'undefined') {
		return
	}

	try {
		localStorage.setItem(LOCALE_STORAGE_KEY, locale)
	}
	catch {
		// ignore private mode / disabled storage
	}

	document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}
