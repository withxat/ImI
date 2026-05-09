import { readVisitorGeoFromRequest } from '@/lib/visitor-geo'

export function GET(req: Request) {
	const geo = readVisitorGeoFromRequest(req)
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
