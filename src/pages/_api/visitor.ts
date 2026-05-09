function regionName(code: string): string {
	try {
		return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
	}
	catch {
		return code
	}
}

interface Cf { country?: string }

export function GET(request: Request) {
	const cf = (request as Request & { cf?: Cf }).cf
	const countryCode = cf?.country ?? null
	const countryName = countryCode ? regionName(countryCode) : null

	return Response.json(
		{ countryCode, countryName },
		{
			headers: {
				'Cache-Control': 'private, no-store',
				'Content-Type': 'application/json; charset=utf-8',
			},
		},
	)
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
