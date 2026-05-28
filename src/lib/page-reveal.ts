const TOP_SCROLL_PX = 16
const REVEAL_DURATION_MS = 420
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export interface PageRevealOptions {
	/** When false, show content immediately (client navigations). */
	animate?: boolean
}

function prefersReducedMotion() {
	return matchMedia('(prefers-reduced-motion: reduce)').matches
}

function viewportHeight() {
	return window.visualViewport?.height ?? window.innerHeight
}

function revealElement(el: HTMLElement, delaySec: number, instant: boolean) {
	el.style.transitionProperty = 'opacity, filter'
	el.style.transitionTimingFunction = EASING
	el.style.transitionDuration = instant ? '0ms' : `${REVEAL_DURATION_MS}ms`
	el.style.transitionDelay = delaySec ? `${delaySec}s` : ''
	el.style.filter = 'blur(0px)'
	el.style.opacity = '1'
}

function initRevealElement(el: HTMLElement, animate: boolean) {
	delete el.dataset.revealInitialized

	const baseDelay = Number(el.dataset.revealBaseDelay ?? 0.06)
	const blur = Number(el.dataset.revealBlur ?? 10)
	const idx = Number(el.dataset.revealStaggerIndex ?? 0)
	const step = Number(el.dataset.revealStaggerStep ?? 0.048)

	if (!animate || prefersReducedMotion()) {
		revealElement(el, 0, true)
		return
	}

	const atTop = window.scrollY <= TOP_SCROLL_PX
	const rect = el.getBoundingClientRect()
	const vh = viewportHeight()
	const pad = 48
	const intersects = rect.top < vh + pad && rect.bottom > -pad
	const belowFold = rect.top > vh - 8
	const aboveViewport = rect.bottom < 8

	if (!atTop && (intersects || aboveViewport)) {
		revealElement(el, 0, true)
		return
	}

	el.style.opacity = '0'
	el.style.filter = `blur(${blur}px)`

	if ((atTop && belowFold) || (!atTop && belowFold)) {
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting)
						continue
					revealElement(el, 0, false)
					io.disconnect()
				}
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
		)
		io.observe(el)
		return
	}

	if (atTop && intersects) {
		const delay = baseDelay + idx * step
		requestAnimationFrame(() => revealElement(el, delay, false))
		return
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue
				revealElement(el, 0, false)
				io.disconnect()
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
	)
	io.observe(el)
}

function initStaggerRoot(root: HTMLElement, animate: boolean) {
	delete root.dataset.staggerInitialized

	const blur = Number(root.dataset.staggerBlur ?? 10)
	const baseDelay = Number(root.dataset.staggerDelay ?? 0.06)
	const step = Number(root.dataset.staggerStep ?? 0.052)
	const itemClass = root.dataset.staggerItemClass ?? ''

	const reduce = prefersReducedMotion()
	const atTop = window.scrollY <= TOP_SCROLL_PX
	const vh = viewportHeight()
	const pad = 48

	const children = [...root.children] as HTMLElement[]

	children.forEach((child, index) => {
		if (itemClass)
			child.classList.add(...itemClass.split(/\s+/).filter(Boolean))

		child.style.transitionProperty = 'opacity, filter'
		child.style.transitionTimingFunction = EASING

		const r = child.getBoundingClientRect()
		const intersects = r.top < vh + pad && r.bottom > -pad
		const aboveViewport = r.bottom < 8

		if (!animate || reduce || (!atTop && (intersects || aboveViewport))) {
			revealElement(child, 0, true)
			return
		}

		child.style.opacity = '0'
		child.style.filter = `blur(${blur}px)`

		if (atTop && intersects) {
			const delay = baseDelay + index * step
			requestAnimationFrame(() => revealElement(child, delay, false))
			return
		}

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting)
						continue
					revealElement(child, 0, false)
					io.disconnect()
				}
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
		)
		io.observe(child)
	})
}

export function initPageReveals({ animate = true }: PageRevealOptions = {}) {
	for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
		if (el.dataset.revealInitialized === '1')
			continue
		el.dataset.revealInitialized = '1'
		initRevealElement(el, animate)
	}

	for (const root of document.querySelectorAll<HTMLElement>('[data-stagger-reveal]')) {
		if (root.dataset.staggerInitialized === '1')
			continue
		root.dataset.staggerInitialized = '1'
		initStaggerRoot(root, animate)
	}
}

declare global {
	interface Window {
		__xatRevealBootstrapped?: boolean
	}
}

export function runPageRevealCycle() {
	const animate = !window.__xatRevealBootstrapped
	initPageReveals({ animate })
	window.__xatRevealBootstrapped = true
	return animate
}
