import type { FC } from 'react'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { nucleoFlagByIso } from '@/lib/nucleo-flag-map'

export async function renderNucleoFlagSvg(
	iso: string,
	size = '1em',
): Promise<null | string> {
	const upper = iso.trim().toUpperCase()
	if (!/^[A-Z]{2}$/.test(upper))
		return null

	const iconName = nucleoFlagByIso[upper as keyof typeof nucleoFlagByIso]
	if (!iconName)
		return null

	try {
		const mod = await import(/* @vite-ignore */ `nucleo-flags/dist/components/${iconName}.js`)
		const Icon = mod[iconName] as FC<Record<string, unknown>>
		if (!Icon)
			return null

		return renderToStaticMarkup(
			createElement(Icon, {
				'aria-hidden': 'true',
				'height': size,
				size,
				'width': size,
			}),
		)
	}
	catch {
		return null
	}
}
