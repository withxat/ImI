let dispose: (() => void) | null = null

const observedAnchors = new WeakSet<HTMLAnchorElement>()
const warmedFonts = new Set<string>()

interface WorkerMessage {
	fonts: string[]
	type: 'fonts'
}

function createFontWorker() {
	return new Worker(new URL('./linked-page-font-prefetch.worker.ts', import.meta.url), { type: 'module' })
}

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

export function initLinkedPageFontPrefetch() {
	dispose?.()
	seedExistingFontHints()

	if (!('IntersectionObserver' in window) || !('Worker' in window)) {
		dispose = null
		return
	}

	const worker = createFontWorker()
	worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
		if (event.data.type !== 'fonts')
			return
		for (const href of event.data.fonts)
			prefetchFont(href)
	})

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting)
				continue

			const anchor = entry.target as HTMLAnchorElement
			observer.unobserve(anchor)
			worker.postMessage({ href: anchor.href, type: 'warm' })
		}
	}, { rootMargin: '320px 0px' })

	for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[data-astro-prefetch="viewport"][href]')) {
		if (observedAnchors.has(anchor))
			continue
		observedAnchors.add(anchor)
		observer.observe(anchor)
	}

	dispose = () => {
		observer.disconnect()
		worker.terminate()
	}
}
