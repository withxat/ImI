const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/** Cookie options shared by middleware when applying a locale switch. */
export function localeCookieOptions() {
	return {
		maxAge: ONE_YEAR_SECONDS,
		path: '/',
		sameSite: 'lax' as const,
	}
}
