/**
 * Presentation-only title tweaks for line breaking. Unicode allows wraps after
 * ordinary spaces (e.g. between “Apple” and “ID”); CSS cannot mark a single
 * ASCII space as non-breaking inside plain text, so we normalize known product
 * phrases here at render time without editing MDX source.
 */
const JOINED_PHRASES: readonly [string, string][] = [
	['Apple ID', 'Apple\u00A0ID'],
	['App Store', 'App\u00A0Store'],
]

export function titleForDisplay(raw: string): string {
	let out = raw
	for (const [plain, joined] of JOINED_PHRASES) {
		out = out.replaceAll(plain, joined)
	}
	return out
}
