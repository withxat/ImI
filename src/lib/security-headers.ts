// Mirrors the `/*` block in public/_headers, which only covers static assets.
const CONTENT_SECURITY_POLICY = [
	'default-src \'self\'',
	'script-src \'self\' \'unsafe-inline\'',
	'style-src \'self\' \'unsafe-inline\'',
	'img-src \'self\' data: https://assets.xat.sh https://avatars.githubusercontent.com',
	'font-src \'self\'',
	'media-src \'self\'',
	'connect-src \'self\'',
	'worker-src \'self\'',
	'object-src \'none\'',
	'base-uri \'self\'',
	'form-action \'self\'',
	'frame-ancestors \'self\'',
].join('; ')

const SECURITY_HEADERS = {
	'Content-Security-Policy': CONTENT_SECURITY_POLICY,
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Strict-Transport-Security': 'max-age=31536000',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
} as const

export function withSecurityHeaders(response: Response) {
	if (import.meta.env.DEV)
		return response

	try {
		for (const [name, value] of Object.entries(SECURITY_HEADERS))
			response.headers.set(name, value)
		return response
	}
	catch {
		// Immutable headers (e.g. `Response.redirect`): copy into a fresh response.
		const copy = new Response(response.body, response)
		for (const [name, value] of Object.entries(SECURITY_HEADERS))
			copy.headers.set(name, value)
		return copy
	}
}
