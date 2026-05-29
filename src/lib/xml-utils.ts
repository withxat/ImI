/** Escape special characters for XML text content and attributes. */
export function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;')
}

/** Escape content for CDATA sections. */
export function escapeCdata(value: string): string {
	return value.replaceAll(']]>', ']]]]><![CDATA[>')
}

/** Create an XML response with standard headers. */
export function xmlResponse(content: string, cacheControl = 'public, max-age=3600, s-maxage=86400'): Response {
	return new Response(content, {
		headers: {
			'Cache-Control': cacheControl,
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}
