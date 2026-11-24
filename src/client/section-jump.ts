const FLASH_MS = 1400
const SCROLL_WAIT_MAX = 1500
const SCROLL_IDLE = 120

/** Runs once the page stops scrolling: `scrollend` where supported, else a short idle after the last scroll event. */
function afterScroll(callback: () => void) {
	const event = 'onscrollend' in window ? 'scrollend' : 'scroll'
	let done = false
	let idleTimer = 0
	let capTimer = 0

	function finish() {
		if (done)
			return
		done = true
		window.removeEventListener(event, onScroll)
		window.clearTimeout(idleTimer)
		window.clearTimeout(capTimer)
		callback()
	}

	function onScroll() {
		if (event === 'scrollend') {
			finish()
			return
		}
		window.clearTimeout(idleTimer)
		idleTimer = window.setTimeout(finish, SCROLL_IDLE)
	}

	capTimer = window.setTimeout(finish, SCROLL_WAIT_MAX)
	window.addEventListener(event, onScroll, { passive: true })
}

function flash(heading: HTMLElement) {
	heading.classList.remove('section-flash')
	void heading.offsetWidth
	heading.classList.add('section-flash')
	window.setTimeout(() => heading.classList.remove('section-flash'), FLASH_MS + 100)
}

/**
 * Scrolls a section heading to its scroll margin, then tints it in the link color for a moment so
 * the eye lands on it. Under reduced motion the jump is instant and the tint switches off without fading.
 */
export function jumpToSection(heading: HTMLElement) {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
	const scroller = document.scrollingElement ?? document.documentElement
	const margin = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0
	const maxScroll = scroller.scrollHeight - window.innerHeight
	const top = Math.min(maxScroll, Math.max(0, heading.getBoundingClientRect().top + window.scrollY - margin))
	const travels = !reduce && Math.abs(top - window.scrollY) > 1

	window.scrollTo({ behavior: reduce ? 'auto' : 'smooth', top })
	if (travels)
		afterScroll(() => flash(heading))
	else
		flash(heading)
}
