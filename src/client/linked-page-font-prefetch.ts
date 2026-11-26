interface WorkerMessage {
	fonts: string[]
	type: 'fonts'
}

let worker: null | Worker = null
let listenerController: AbortController | null = null

const warmedPages = new Set<string>()
const warmedFonts = new Set<string>()

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
	document.head.appendChild(link)
}

function seedExistingFontHints() {
	for (const link of document.querySelectorAll<HTMLLinkElement>('link[as="font"][href]')) {
		const url = sameOriginUrl(link.href)
		if (url)
			warmedFonts.add(url.href)
	}
}

function ensureWorker(): null | Worker {
	if (worker)
		return worker
	if (!('Worker' in window))
		return null

	worker = new Worker(new URL('./linked-page-font-prefetch.worker.ts', import.meta.url), { type: 'module' })
	worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
		if (event.data.type !== 'fonts')
			return
		for (const href of event.data.fonts)
			prefetchFont(href)
	})
	return worker
}

function warmAnchor(target: EventTarget | null) {
	if (!(target instanceof Element))
		return

	const anchor = target.closest<HTMLAnchorElement>('a[data-astro-prefetch][href]')
	if (!anchor)
		return

	const url = sameOriginUrl(anchor.href)
	if (!url || url.pathname === window.location.pathname)
		return

	// Key by locale + pathname so switching locale warms the new language's font subsets.
	const locale = document.documentElement.lang || 'en'
	const key = `${locale}:${url.pathname}`
	if (warmedPages.has(key))
		return
	warmedPages.add(key)

	ensureWorker()?.postMessage({ href: url.href, locale, type: 'warm' })
}

export function disposeLinkedPageFontPrefetch() {
	listenerController?.abort()
	listenerController = null
}

/**
 * Warms font subsets for prefetched internal links on user intent (hover, focus, touchstart)
 * instead of eagerly fetching every visible post on viewport load.
 */
export function initLinkedPageFontPrefetch() {
	disposeLinkedPageFontPrefetch()
	seedExistingFontHints()

	if (!('Worker' in window))
		return

	listenerController = new AbortController()
	const { signal } = listenerController

	document.addEventListener('pointerenter', (event) => {
		if (event.pointerType === 'touch')
			return
		warmAnchor(event.target)
	}, { capture: true, passive: true, signal })

	document.addEventListener('focusin', (event) => {
		warmAnchor(event.target)
	}, { passive: true, signal })

	document.addEventListener('touchstart', (event) => {
		warmAnchor(event.target)
	}, { passive: true, signal })
}
