import type { Locale } from '@/lib/i18n/constants'

// Rendered HTML only varies by locale and visitor country (footer greeting). Footer
// stats are baked in too, but the client refreshes them right after load, so a few
// minutes of staleness is invisible. The commit SHA in the key makes every deploy
// start from a cold cache, which is how content updates go live.
const EDGE_CACHE_TTL_SECONDS = 600
const EDGE_CACHE_ORIGIN = 'https://edge-cache.internal'
const EDGE_CACHE_STATUS_HEADER = 'X-Imi-Cache'

interface EdgeCacheKeyInput {
	countryCode: null | string
	locale: Locale
	pathname: string
}

function edgeCache(): Cache | null {
	if (import.meta.env.DEV)
		return null

	return (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default ?? null
}

export function isEdgeCacheableRequest(request: Request, url: URL) {
	if (request.method !== 'GET')
		return false

	// Query strings would let anyone fan out cache entries; `?set_locale=` is handled earlier.
	if (url.search)
		return false

	if (url.pathname.startsWith('/api/'))
		return false

	return true
}

export function edgeCacheKey({ countryCode, locale, pathname }: EdgeCacheKeyInput) {
	const key = new URL(pathname, EDGE_CACHE_ORIGIN)
	key.searchParams.set('v', import.meta.env.PUBLIC_IMI_COMMIT_SHA ?? 'dev')
	key.searchParams.set('locale', locale)
	key.searchParams.set('cc', countryCode ?? 'XX')
	return new Request(key)
}

export async function matchEdgeCache(key: Request) {
	const cached = await edgeCache()?.match(key)
	if (!cached)
		return null

	const headers = new Headers(cached.headers)
	headers.delete('Cache-Control')
	headers.set(EDGE_CACHE_STATUS_HEADER, 'HIT')
	return new Response(cached.body, { headers, status: cached.status })
}

function isEdgeCacheableResponse(response: Response) {
	if (response.status !== 200)
		return false

	if (!response.headers.get('Content-Type')?.includes('text/html'))
		return false

	if (response.headers.has('Set-Cookie'))
		return false

	const cacheControl = response.headers.get('Cache-Control') ?? ''
	return !/no-store|private/i.test(cacheControl)
}

/** Stores a copy of `response` and returns the response to send (marked as a miss). */
export function putEdgeCache(key: Request, response: Response, waitUntil?: (promise: Promise<unknown>) => void) {
	const cache = edgeCache()
	if (!cache || !waitUntil || !isEdgeCacheableResponse(response))
		return response

	const stored = new Headers(response.headers)
	stored.set('Cache-Control', `public, max-age=${EDGE_CACHE_TTL_SECONDS}`)
	waitUntil(
		cache.put(key, new Response(response.clone().body, { headers: stored, status: response.status }))
			.catch(() => undefined),
	)

	const headers = new Headers(response.headers)
	headers.set(EDGE_CACHE_STATUS_HEADER, 'MISS')
	return new Response(response.body, { headers, status: response.status, statusText: response.statusText })
}
