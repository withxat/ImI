import type { Locale } from '@/lib/i18n/constants'

import {
	DEFAULT_LOCALE,
	isLocale,
	LOCALE_COOKIE_NAME,
	normalizeStoredLocale,
} from '@/lib/i18n/constants'

function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
	if (!cookieHeader) {
		return {}
	}
	const out: Record<string, string> = {}
	for (const part of cookieHeader.split(';')) {
		const trimmed = part.trim()
		const eq = trimmed.indexOf('=')
		if (eq <= 0) {
			continue
		}
		const name = trimmed.slice(0, eq).trim()
		const value = trimmed.slice(eq + 1).trim()
		try {
			out[name] = decodeURIComponent(value)
		}
		catch {
			out[name] = value
		}
	}
	return out
}

function localeFromAcceptLanguage(header: string | undefined): Locale | null {
	if (!header) {
		return null
	}

	const entries = header.split(',').map((raw) => {
		const [langPart, ...params] = raw.trim().split(';')
		const lang = langPart.trim().toLowerCase()
		let q = 1
		for (const p of params) {
			const s = p.trim()
			if (s.startsWith('q=')) {
				const n = Number.parseFloat(s.slice(2))
				if (Number.isFinite(n)) {
					q = n
				}
			}
		}
		return { lang, q }
	})

	entries.sort((a, b) => b.q - a.q)

	for (const { lang } of entries) {
		const base = lang.split('-')[0] ?? lang
		if (lang === 'zh-cn' || lang === 'zh-hans' || lang === 'zh-sg' || base === 'zh') {
			return 'zh'
		}
		if (base === 'ja') {
			return 'ja'
		}
		if (base === 'en') {
			return 'en'
		}
	}

	return null
}

export function resolveLocaleFromHeaders(
	cookieHeader: string | undefined,
	acceptLanguage: string | undefined,
): Locale {
	const cookies = parseCookieHeader(cookieHeader)
	const rawCookie = cookies[LOCALE_COOKIE_NAME]
	const fromCookie = rawCookie ? normalizeStoredLocale(rawCookie.trim()) : undefined
	if (fromCookie && isLocale(fromCookie)) {
		return fromCookie
	}

	const fromAccept = localeFromAcceptLanguage(acceptLanguage)
	if (fromAccept) {
		return fromAccept
	}

	return DEFAULT_LOCALE
}

export function getRequestLocale(): Locale {
	// In Astro, read request headers in middleware and pass the locale via `Astro.locals`.
	return DEFAULT_LOCALE
}
