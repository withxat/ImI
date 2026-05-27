'use client'

import { useEffect } from 'react'

export function MiSansContentFontStyles() {
	useEffect(() => {
		void import('@/assets/mi-sans-vf.ttf?subsets&key=content').catch(() => {})
	}, [])

	return null
}
