interface Cf { country?: string }

export interface VisitorGeo { countryCode: null | string, countryName: null | string }

export function regionName(code: string): string {
	try {
		return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
	}
	catch {
		return code
	}
}

/** Read Cloudflare `cf.country` from the incoming Worker request (no AsyncLocalStorage). */
export function readVisitorGeoFromRequest(req: Request): VisitorGeo {
	const cf = (req as Request & { cf?: Cf }).cf
	const countryCode = cf?.country ?? null
	if (!countryCode) {
		return { countryCode: null, countryName: null }
	}
	return { countryCode, countryName: regionName(countryCode) }
}
