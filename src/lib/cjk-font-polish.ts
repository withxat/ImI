/**
 * Pseudo-weight remapping for MiSans VF subsets emitted by `vite-plugin-font`.
 *
 * The problem: Hanken (Latin) and MiSans (CJK) share the same `font-weight`
 * scale visually but not numerically — applying `font-weight: 600` to a mixed
 * line gives a beautiful SemiBold Latin and a too-heavy CJK in the same breath.
 *
 * The (elegant) fix: CSS Fonts L4 lets `@font-face` carry a
 * `font-variation-settings` *descriptor* that pins the VF wght axis to a custom
 * value while still advertising a Latin-aligned `font-weight` to the cascade.
 * Browsers per-glyph-select the closest weight face per family stack, so a
 * single `font-weight: 600` resolves to Hanken@600 + MiSans@wght500 on the
 * same line — no DOM wrapping needed.
 *
 * `vite-plugin-font` / `cn-font-split` already preserves the fvar axis through
 * its WOFF2 chunks but only emits a single `font-weight: 400` face per chunk.
 * This Vite plugin reaches into its generated `result.css` and clones every
 * `@font-face` into one variant per Latin → CJK weight mapping below, sharing
 * the same chunk URL (free at the network layer thanks to HTTP cache).
 *
 * Hard constraint: any element-level `font-variation-settings` *property*
 * overrides these descriptors. Don't set that property anywhere in the codebase.
 * (Use `font-weight` instead; the descriptor will do the right thing.)
 */

// Vite isn't a direct dependency (it ships transitively via Astro). The shape
// below is the minimum surface this plugin needs from `vite.Plugin` and stays
// compatible with the full type if Vite is ever added to the project deps.
interface TransformResult {
	code: string
	map: null
}
interface CjkFontPolishPlugin {
	enforce: 'pre'
	name: 'cjk-font-polish'
	transform: (code: string, id: string) => null | TransformResult
}

export const CJK_POLISH_FAMILY = 'MiSans Polish'

const CJK_WEIGHT_MAP: ReadonlyArray<readonly [latin: number, wght: number]> = [
	[400, 330],
	[500, 415],
	[600, 500],
]

const TARGET_ID_RE = /\/\.subsets\/.+\/result\.css(?:\?|$)/
const FONT_FACE_RE = /@font-face\s*\{([^}]*)\}/g
const FONT_FAMILY_DECL_RE = /font-family\s*:[^;}]*;?/gi
const FONT_WEIGHT_DECL_RE = /font-weight\s*:[^;}]*;?/gi
const FONT_VARIATION_DECL_RE = /font-variation-settings\s*:[^;}]*;?/gi

function polishFontFace(rawBody: string): string {
	const body = rawBody
		.replace(FONT_FAMILY_DECL_RE, '')
		.replace(FONT_WEIGHT_DECL_RE, '')
		.replace(FONT_VARIATION_DECL_RE, '')
		.trim()
	return CJK_WEIGHT_MAP
		.map(([latin, wght]) =>
			`@font-face{font-family:'${CJK_POLISH_FAMILY}';font-weight:${latin};font-variation-settings:'wght' ${wght};${body}}`,
		)
		.join('\n')
}

export default function cjkFontPolish(): CjkFontPolishPlugin {
	return {
		enforce: 'pre',
		name: 'cjk-font-polish',
		transform(code, id) {
			if (!TARGET_ID_RE.test(id))
				return null
			if (!code.includes('@font-face'))
				return null
			const next = code.replace(FONT_FACE_RE, (_: string, body: string) => polishFontFace(body))
			return { code: next, map: null }
		},
	}
}
