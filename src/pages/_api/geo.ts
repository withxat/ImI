import { resolveLocaleFromHeaders } from '@/lib/i18n/request-locale'
import { readVisitorGeoFromRequest, regionDisplayName } from '@/lib/visitor-geo'

export function GET(req: Request) {
	const { countryCode } = readVisitorGeoFromRequest(req)
	if (!countryCode) {
		return new Response(JSON.stringify({ countryCode: null, countryName: null }), {
			headers: {
				'Cache-Control': 'private, no-store',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
	}

	const locale = resolveLocaleFromHeaders(
		req.headers.get('cookie') ?? undefined,
		req.headers.get('accept-language') ?? undefined,
	)
	const geo = {
		countryCode,
		countryName: regionDisplayName(countryCode, locale),
	}

	return new Response(JSON.stringify(geo), {
		headers: {
			'Cache-Control': 'private, no-store',
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
