const WIDE_CHAR_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u3000-\u303F\uFF00-\uFFEF]/u

/**
 * Truncates text by approximate visual width: full-width CJK glyphs count as 2
 * units and narrow Latin glyphs as 1, so zh/ja and en fill roughly the same
 * number of lines in Satori OG cards.
 */
export function truncate(text: string, maxUnits: number) {
	const trimmed = text.trim()
	let used = 0
	let cutIndex = 0

	for (const char of trimmed) {
		const width = WIDE_CHAR_RE.test(char) ? 2 : 1
		if (used + width > maxUnits) {
			return `${trimmed.slice(0, cutIndex).trimEnd()}…`
		}
		used += width
		cutIndex += char.length
	}

	return trimmed
}
