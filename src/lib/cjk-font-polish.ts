/**
 * Pseudo-weight remapping for MiSans static subsets emitted by `vite-plugin-font`.
 *
 * The problem: Hanken (Latin) and MiSans (CJK) share the same `font-weight`
 * scale visually but not numerically — applying `font-weight: 600` to a mixed
 * line gives a beautiful SemiBold Latin and a too-heavy CJK in the same breath.
 *
 * The fix: feed vite-plugin-font three static MiSans weights, then rewrite the
 * emitted faces into one family with Latin-aligned `font-weight` descriptors.
 * Browsers per-glyph-select the closest weight face per family stack, so a
 * single `font-weight: 600` resolves to Hanken@600 + MiSans Medium on the same
 * line — no DOM wrapping needed.
 *
 * The old version used `font-variation-settings` inside `@font-face`, but iOS
 * Safari does not honor that descriptor. Static instances keep the polish while
 * staying inside the widely-supported `@font-face` surface.
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

export const CJK_FONT_FAMILY = 'MiSans'

const CJK_FONT_IMPORTS: ReadonlyArray<readonly [pattern: RegExp, latinWeight: number]> = [
	[/mi-sans-light(?:\.woff2|_woff2)(?:[/?]|$)/, 400],
	[/mi-sans-normal(?:\.woff2|_woff2)(?:[/?]|$)/, 500],
	[/mi-sans-medium(?:\.woff2|_woff2)(?:[/?]|$)/, 600],
]

const TARGET_ID_RE = /\/\.subsets\/.+\/result\.css(?:\?|$)/
const RESULT_CSS_IMPORT_RE = /import\s+['"]([^'"]*\/result\.css(?:\?[^'"]*)?)['"]/g
const FONT_FACE_RE = /@font-face\s*\{([^}]*)\}/g
const FONT_FAMILY_DECL_RE = /font-family\s*:[^;}]*;?/gi
const FONT_WEIGHT_DECL_RE = /font-weight\s*:[^;}]*;?/gi
const FONT_VARIATION_DECL_RE = /font-variation-settings\s*:[^;}]*;?/gi

function normalizeResultCssId(id: string): string {
	return id.split('?')[0] ?? id
}

function latinWeightForFontImport(id: string): number | undefined {
	return CJK_FONT_IMPORTS.find(([pattern]) => pattern.test(id))?.[1]
}

function polishFontFace(rawBody: string, latinWeight: number): string {
	const body = rawBody
		.replace(FONT_FAMILY_DECL_RE, '')
		.replace(FONT_WEIGHT_DECL_RE, '')
		.replace(FONT_VARIATION_DECL_RE, '')
		.trim()
	return `@font-face{font-family:'${CJK_FONT_FAMILY}';font-weight:${latinWeight};${body}}`
}

export default function cjkFontPolish(): CjkFontPolishPlugin {
	const cssWeights = new Map<string, number>()

	return {
		enforce: 'pre',
		name: 'cjk-font-polish',
		transform(code, id) {
			if (TARGET_ID_RE.test(id) && code.includes('@font-face')) {
				const cssWeight = cssWeights.get(normalizeResultCssId(id)) ?? latinWeightForFontImport(id)
				if (!cssWeight)
					return null

				const next = code.replace(FONT_FACE_RE, (_: string, body: string) => polishFontFace(body, cssWeight))
				return { code: next, map: null }
			}

			const fontWeight = latinWeightForFontImport(id)
			if (fontWeight) {
				for (const match of code.matchAll(RESULT_CSS_IMPORT_RE))
					cssWeights.set(normalizeResultCssId(match[1]!), fontWeight)
				return null
			}

			return null
		},
	}
}
