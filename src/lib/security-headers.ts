// Mirrors the `/*` block in public/_headers, which only covers static assets.
const SECURITY_HEADERS = {
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
