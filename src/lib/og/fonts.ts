import type { SatoriOptions } from 'satori'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { OG_FONT_FAMILY } from '@/lib/og/constants'
import { OG_FONT_FILES } from '@/lib/og/font-files'

const root = fileURLToPath(new URL('../../../', import.meta.url))

function loadFont(relativePath: string): ArrayBuffer {
	const bytes = readFileSync(join(root, relativePath))
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

type FontWeight = 400 | 500 | 600

function fontEntry(
	name: string,
	relativePath: string,
	weight: FontWeight,
): NonNullable<SatoriOptions['fonts']>[number] {
	return {
		data: loadFont(relativePath),
		name,
		style: 'normal',
		weight,
	}
}

let fontsCache: SatoriOptions['fonts'] | undefined

export function getOgFonts(): NonNullable<SatoriOptions['fonts']> {
	if (fontsCache)
		return fontsCache

	const weights = [400, 500, 600] as const

	fontsCache = [
		fontEntry(OG_FONT_FAMILY.wordmark, OG_FONT_FILES.fugaz, 400),
		...weights.map(w => fontEntry(OG_FONT_FAMILY.display, OG_FONT_FILES.hanken[w], w)),
		...weights.map(w => fontEntry(OG_FONT_FAMILY.cjk, OG_FONT_FILES.miSans[w], w)),
	]

	return fontsCache
}
