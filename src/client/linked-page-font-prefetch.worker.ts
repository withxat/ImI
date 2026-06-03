interface WarmMessage {
	href: string
	type: 'warm'
}

interface FontMessage {
	fonts: string[]
	type: 'fonts'
}

const warmedPages = new Set<string>()
const warmedStylesheets = new Set<string>()

const FONT_FACE_RE = /@font-face\s*\{[^}]*\}/gi
const FONT_URL_RE = /url\((['"]?)([^)'"]+\.(?:woff2?|ttf|otf)(?:\?[^)'"]*)?)\1\)/i
const FONT_FAMILY_RE = /font-family\s*:\s*([^;]+)/i
const UNICODE_RANGE_RE = /unicode-range\s*:\s*([^;]+)/i
const LINK_TAG_RE = /<link\b[^>]*>/gi
const HREF_RE = /\bhref=(['"])(.*?)\1/i
const REL_STYLESHEET_RE = /\brel=(['"])[^'"]*\bstylesheet\b[^'"]*\1/i

function sameOriginUrl(href: string) {
	try {
		const url = new URL(href, globalThis.location.href)
		return url.origin === globalThis.location.origin ? url : null
	}
	catch {
		return null
	}
}

function collectCodePoints(text: string) {
	const points = new Set<number>()
	for (const char of text) {
		const codePoint = char.codePointAt(0)
		if (codePoint !== undefined)
			points.add(codePoint)
	}
	return points
}

function unicodeTokenToRange(token: string): null | readonly [number, number] {
	const raw = token.trim().toUpperCase()
	if (!raw.startsWith('U+'))
		return null

	const body = raw.slice(2)
	if (body.includes('?')) {
		const start = Number.parseInt(body.replace(/\?/g, '0'), 16)
		const end = Number.parseInt(body.replace(/\?/g, 'F'), 16)
		return Number.isFinite(start) && Number.isFinite(end) ? [start, end] : null
	}

	const [startRaw, endRaw = startRaw] = body.split('-')
	const start = Number.parseInt(startRaw, 16)
	const end = Number.parseInt(endRaw, 16)
	return Number.isFinite(start) && Number.isFinite(end) ? [start, end] : null
}

function unicodeRangeMatchesText(unicodeRange: string, codePoints: Set<number>) {
	const ranges = unicodeRange
		.split(',')
		.map(unicodeTokenToRange)
		.filter((range): range is readonly [number, number] => range !== null)

	if (!ranges.length)
		return true

	for (const codePoint of codePoints) {
		for (const [start, end] of ranges) {
			if (codePoint >= start && codePoint <= end)
				return true
		}
	}

	return false
}

function unquoteCssValue(value: string) {
	return value.trim().replace(/^['"]|['"]$/g, '')
}

function stripHtmlToText(html: string) {
	return html
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
}

function hasCodeSurface(html: string) {
	return /<(?:code|pre)\b/i.test(html) || /\bclass=(['"])[^'"]*\bexpressive-code\b[^'"]*\1/i.test(html)
}

function collectStylesheetHrefs(html: string, pageUrl: string) {
	const hrefs: string[] = []
	for (const match of html.matchAll(LINK_TAG_RE)) {
		if (!REL_STYLESHEET_RE.test(match[0]))
			continue
		const href = match[0].match(HREF_RE)?.[2]
		if (href)
			hrefs.push(new URL(href, pageUrl).href)
	}
	return hrefs
}

function shouldPrefetchUnrangedFont(fontFace: string, documentText: string, hasCode: boolean) {
	const family = unquoteCssValue(fontFace.match(FONT_FAMILY_RE)?.[1] ?? '')

	if (family === 'Hanken Grotesk' || family === 'Fugaz One')
		return true

	if (family === 'Calling Code')
		return hasCode

	return documentText.trim().length > 0
}

function resolveFontHref(rawHref: string, stylesheetUrl: string) {
	return new URL(rawHref, stylesheetUrl).href
}

async function warmStylesheetFonts(stylesheetUrl: string, documentText: string, codePoints: Set<number>, hasCode: boolean) {
	if (warmedStylesheets.has(stylesheetUrl))
		return []
	warmedStylesheets.add(stylesheetUrl)

	const response = await fetch(stylesheetUrl, { credentials: 'same-origin', priority: 'low' })
	if (!response.ok)
		return []

	const fonts: string[] = []
	const css = await response.text()
	for (const fontFace of css.match(FONT_FACE_RE) ?? []) {
		const rawFontHref = fontFace.match(FONT_URL_RE)?.[2]
		if (!rawFontHref)
			continue

		const unicodeRange = fontFace.match(UNICODE_RANGE_RE)?.[1]
		const shouldPrefetch = unicodeRange
			? unicodeRangeMatchesText(unicodeRange, codePoints)
			: shouldPrefetchUnrangedFont(fontFace, documentText, hasCode)

		if (shouldPrefetch)
			fonts.push(resolveFontHref(rawFontHref, stylesheetUrl))
	}

	return fonts
}

async function warmLinkedPageFonts(href: string) {
	const pageUrl = sameOriginUrl(href)
	if (!pageUrl || warmedPages.has(pageUrl.href))
		return
	warmedPages.add(pageUrl.href)

	try {
		const response = await fetch(pageUrl.href, { credentials: 'same-origin', priority: 'low' })
		if (!response.ok)
			return

		const html = await response.text()
		const documentText = stripHtmlToText(html)
		const codePoints = collectCodePoints(documentText)
		const stylesheets = collectStylesheetHrefs(html, pageUrl.href)
		const fonts = await Promise.all(
			stylesheets.map(stylesheet => warmStylesheetFonts(stylesheet, documentText, codePoints, hasCodeSurface(html))),
		)

		globalThis.postMessage({ fonts: [...new Set(fonts.flat())], type: 'fonts' } satisfies FontMessage)
	}
	catch {}
}

globalThis.addEventListener('message', (event: MessageEvent<WarmMessage>) => {
	if (event.data.type === 'warm')
		void warmLinkedPageFonts(event.data.href)
})
