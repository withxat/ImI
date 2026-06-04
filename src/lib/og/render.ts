import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

import { getOgFonts } from '@/lib/og/fonts'
import { ogRenderSize } from '@/lib/og/template'

export async function renderOgPng(element: unknown) {
	const svg = await satori(element, {
		...ogRenderSize,
		fonts: getOgFonts(),
	})

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: ogRenderSize.width },
	})

	return resvg.render().asPng()
}
