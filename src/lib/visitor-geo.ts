import { unstable_getContext } from 'waku/server'

interface Cf { country?: string }

function regionName(code: string): string {
	try {
		return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
	}
	catch {
		return code
	}
}

export function getVisitorGeo(): { countryCode: null | string, countryName: null | string } {
	try {
		const { req } = unstable_getContext()
		const cf = (req as Request & { cf?: Cf }).cf
		const countryCode = cf?.country ?? null
		if (!countryCode) {
			return { countryCode: null, countryName: null }
		}
		return { countryCode, countryName: regionName(countryCode) }
	}
	catch {
		return { countryCode: null, countryName: null }
	}
}
