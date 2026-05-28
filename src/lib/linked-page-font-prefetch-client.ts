let dispose: (() => void) | null = null

const observedAnchors = new WeakSet<HTMLAnchorElement>()
const warmedPages = new Set<string>()
const warmedStylesheets = new Set<string>()
const warmedFonts = new Set<string>()

const FONT_FACE_RE = /@font-face\s*\{[^}]*\}/gi
const FONT_URL_RE = /url\((['"]?)([^)'"]+\.(?:woff2?|ttf|otf)(?:\?[^)'"]*)?)\1\)/i
const FONT_FAMILY_RE = /font-family\s*:\s*([^;]+)/i
const UNICODE_RANGE_RE = /unicode-range\s*:\s*([^;]+)/i

function sameOriginUrl(href: string) {
	try {
		const url = new URL(href, window.location.href)
		return url.origin === window.location.origin ? url : null
	}
	catch {
		return null
	}
}

function fontTypeFor(href: string) {
	const path = new URL(href, window.location.href).pathname
	if (path.endsWith('.woff2'))
		return 'font/woff2'
	if (path.endsWith('.woff'))
		return 'font/woff'
	if (path.endsWith('.otf'))
		return 'font/otf'
	return 'font/ttf'
}

function prefetchFont(href: string) {
	const url = sameOriginUrl(href)
	if (!url)
		return

	const normalized = url.href
	if (warmedFonts.has(normalized))
		return
	warmedFonts.add(normalized)

	const link = document.createElement('link')
	link.as = 'font'
	link.crossOrigin = 'anonymous'
	link.href = normalized
	link.rel = 'prefetch'
	link.type = fontTypeFor(normalized)
	document.head.append(link)
}

function seedExistingFontHints() {
	for (const link of document.querySelectorAll<HTMLLinkElement>('link[as="font"][href]')) {
		const url = sameOriginUrl(link.href)
		if (url)
			warmedFonts.add(url.href)
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

function shouldPrefetchUnrangedFont(fontFace: string, documentText: string, targetDocument: Document) {
	const family = unquoteCssValue(fontFace.match(FONT_FAMILY_RE)?.[1] ?? '')

	if (family === 'Hanken Grotesk' || family === 'Fugaz One' || family === 'Source Han Serif SC Subset')
		return true

	if (family === 'Calling Code')
		return targetDocument.querySelector('code, pre, .expressive-code') !== null

	return documentText.trim().length > 0
}

function resolveFontHref(rawHref: string, stylesheetUrl: string) {
	return new URL(rawHref, stylesheetUrl).href
}

async function warmStylesheetFonts(stylesheetUrl: string, targetDocument: Document, codePoints: Set<number>) {
	if (warmedStylesheets.has(stylesheetUrl))
		return
	warmedStylesheets.add(stylesheetUrl)

	const response = await fetch(stylesheetUrl, { credentials: 'same-origin', priority: 'low' })
	if (!response.ok)
		return

	const css = await response.text()
	const documentText = targetDocument.body?.textContent ?? ''
	for (const fontFace of css.match(FONT_FACE_RE) ?? []) {
		const rawFontHref = fontFace.match(FONT_URL_RE)?.[2]
		if (!rawFontHref)
			continue

		const unicodeRange = fontFace.match(UNICODE_RANGE_RE)?.[1]
		const shouldPrefetch = unicodeRange
			? unicodeRangeMatchesText(unicodeRange, codePoints)
			: shouldPrefetchUnrangedFont(fontFace, documentText, targetDocument)

		if (shouldPrefetch)
			prefetchFont(resolveFontHref(rawFontHref, stylesheetUrl))
	}
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
		const targetDocument = new DOMParser().parseFromString(html, 'text/html')
		const codePoints = collectCodePoints(targetDocument.body?.textContent ?? '')

		const stylesheets = Array.from(
			targetDocument.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"][href]'),
			link => new URL(link.href, pageUrl.href).href,
		)

		await Promise.all(stylesheets.map(stylesheet => warmStylesheetFonts(stylesheet, targetDocument, codePoints)))
	}
	catch {}
}

export function initLinkedPageFontPrefetch() {
	dispose?.()
	seedExistingFontHints()

	if (!('IntersectionObserver' in window)) {
		dispose = null
		return
	}

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting)
				continue

			const anchor = entry.target as HTMLAnchorElement
			observer.unobserve(anchor)
			void warmLinkedPageFonts(anchor.href)
		}
	}, { rootMargin: '320px 0px' })

	for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[data-astro-prefetch="viewport"][href]')) {
		if (observedAnchors.has(anchor))
			continue
		observedAnchors.add(anchor)
		observer.observe(anchor)
	}

	dispose = () => observer.disconnect()
}
