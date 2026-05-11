'use client'

/**
 * Loads Noto Serif SC without blocking first paint (`media="print"` swap).
 */
export function ZhSerifStylesheet() {
	return (
		<>
			<link
				onLoad={(e) => {
					(e.currentTarget as HTMLLinkElement).media = 'all'
				}}
				href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap"
				media="print"
				rel="stylesheet"
			/>
			<noscript>
				<link
					href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap"
					rel="stylesheet"
				/>
			</noscript>
		</>
	)
}
