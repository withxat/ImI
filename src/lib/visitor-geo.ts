import type { Locale } from '@/lib/i18n/constants'

import { unstable_getHeaders } from 'waku/server'

import { intlLocaleFor } from '@/lib/i18n/constants'

interface Cf { country?: string }

export interface VisitorGeo { countryCode: null | string, countryName: null | string }

export function regionDisplayName(code: string, locale: Locale): string {
	try {
		return new Intl.DisplayNames([intlLocaleFor(locale)], { type: 'region' }).of(code) ?? code
	}
	catch {
		return code
	}
}

function normalizedCountryCode(code: null | string | undefined): null | string {
	if (!code)
		return null

	const normalized = code.trim().toUpperCase()
	if (normalized === 'XX')
		return null
	if (!/^[A-Z]{2}$/.test(normalized))
		return null

	return normalized
}

/** Read Cloudflare `cf.country` from the incoming Worker request (no AsyncLocalStorage). */
export function readVisitorGeoFromRequest(req: Request): VisitorGeo {
	const cf = (req as Request & { cf?: Cf }).cf
	const countryCode = normalizedCountryCode(cf?.country ?? req.headers.get('cf-ipcountry'))
	if (!countryCode) {
		return { countryCode: null, countryName: null }
	}
	return { countryCode, countryName: null }
}

export function getRequestVisitorGeo(): VisitorGeo {
	try {
		const headers = unstable_getHeaders()
		const countryCode = normalizedCountryCode(headers['cf-ipcountry'])
		return { countryCode, countryName: null }
	}
	catch {
		return { countryCode: null, countryName: null }
	}
}
