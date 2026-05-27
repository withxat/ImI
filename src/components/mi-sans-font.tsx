'use client'

import { useEffect } from 'react'

const hankenFontStack = '"Hanken Grotesk"'

export function MiSansFontStyles() {
	useEffect(() => {
		let cancelled = false

		void import('@/assets/mi-sans-vf.ttf?subsets')
			.then(({ css, fontFamilyFallback }) => {
				if (cancelled) {
					return
				}

				const sansFontStack = `${hankenFontStack}, ${css.family}, ${fontFamilyFallback}`
				document.documentElement.style.setProperty('--font-display', sansFontStack)
				document.documentElement.style.setProperty('--font-text', sansFontStack)
				document.documentElement.style.setProperty('--font-ui', sansFontStack)
			})
			.catch(() => {})

		return () => {
			cancelled = true
		}
	}, [])

	return null
}
