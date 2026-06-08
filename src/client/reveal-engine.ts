const DEFAULT_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DEFAULT_DURATION_MS = 420
const TOP_SCROLL_PX = 16

export interface RevealOptions {
	blur?: number
	duration?: number
	easing?: string
	instant?: boolean
	y?: number
}

export interface ScrollObserverOptions {
	belowFoldOnly?: boolean
	rootMargin?: string
	threshold?: number
}

/** Check if the user prefers reduced motion. */
export function prefersReducedMotion(): boolean {
	return matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Get viewport height, accounting for visual viewport. */
export function viewportHeight(): number {
	return window.visualViewport?.height ?? window.innerHeight
}

/** Check if the user is near the top of the page. */
export function isAtTop(): boolean {
	return window.scrollY <= TOP_SCROLL_PX
}

/** Check if an element is currently visible in the viewport. */
export function isInViewport(rect: DOMRect, pad = 48): boolean {
	const vh = viewportHeight()
	return rect.top < vh + pad && rect.bottom > -pad
}

/** Check if an element is below the fold. */
export function isBelowFold(rect: DOMRect): boolean {
	return rect.top > viewportHeight() - 8
}

/** Check if an element is above the visible viewport. */
export function isAboveViewport(rect: DOMRect): boolean {
	return rect.bottom < 8
}

/** Apply reveal styles to an element (make it visible). */
export function revealElement(el: HTMLElement, options: RevealOptions = {}): void {
	const {
		duration = DEFAULT_DURATION_MS,
		easing = DEFAULT_EASING,
		instant = false,
	} = options

	el.removeAttribute('data-reveal-pending')
	el.dataset.revealReady = 'true'
	el.style.transitionProperty = 'opacity, filter, transform'
	el.style.transitionTimingFunction = easing
	el.style.transitionDuration = instant ? '0ms' : `${duration}ms`
	el.style.filter = 'none'
	el.style.opacity = '1'
	el.style.transform = 'translate3d(0, 0, 0)'

	const clearRevealTransform = () => {
		el.style.transform = ''
	}

	if (instant) {
		clearRevealTransform()
		return
	}

	el.addEventListener('transitionend', clearRevealTransform, { once: true })
}

/** Initialize an element for reveal (set it to hidden state). */
export function initRevealHidden(el: HTMLElement, blur = 10, y = 10): void {
	el.setAttribute('data-reveal-pending', '')
	el.dataset.revealReady = 'false'
	el.style.opacity = '0'
	el.style.filter = `blur(${blur}px)`
	el.style.transform = `translate3d(0, ${y}px, 0)`
}

/** Create an IntersectionObserver for scroll-based reveals. */
export function createScrollObserver(
	callback: (el: HTMLElement) => void,
	options: ScrollObserverOptions = {},
): IntersectionObserver {
	const {
		rootMargin = '0px 0px -10% 0px',
		threshold = 0.14,
	} = options

	return new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue
				callback(entry.target as HTMLElement)
			}
		},
		{ rootMargin, threshold },
	)
}

/**
 * Determine the reveal strategy for an element based on its position.
 * Returns 'instant' | 'stagger' | 'observe' | 'skip'.
 */
export function classifyRevealPosition(
	rect: DOMRect,
	animate: boolean,
	reducedMotion: boolean,
): 'instant' | 'observe' | 'skip' | 'stagger' {
	if (!animate || reducedMotion)
		return 'instant'

	const atTop = isAtTop()
	const intersects = isInViewport(rect)
	const belowFold = isBelowFold(rect)
	const aboveViewport = isAboveViewport(rect)

	// Not at top and visible or above → skip animation
	if (!atTop && (intersects || aboveViewport))
		return 'skip'

	// Below fold → observe for intersection
	if (belowFold)
		return 'observe'

	// At top and visible → stagger reveal
	if (atTop && intersects)
		return 'stagger'

	// Default → observe
	return 'observe'
}
