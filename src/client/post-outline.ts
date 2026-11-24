import {
	closeSectionOutline,
	openSectionOutline,
	SECTION_OUTLINE_CHANGE,
	SECTION_OUTLINE_ID,
	SECTION_OUTLINE_TRIGGER,
	sectionOutlineMode,
} from '@/client/custom-scrollbar'
import { jumpToSection } from '@/client/section-jump'

/** The plain section list under a post's date, used when the custom scrollbar is off. */
const FALLBACK_LIST_ID = 'post-sections'

let abortController: AbortController | null = null

export function disposePostOutline() {
	abortController?.abort()
	abortController = null
}

/**
 * Binds the "N sections" button after a post's date. It opens the scrollbar outline: a hover
 * previews it, a click or Enter pins it. Without the custom scrollbar (reduced motion) it toggles
 * the plain list under the date instead.
 */
export function initPostOutline() {
	disposePostOutline()

	const trigger = document.querySelector<HTMLButtonElement>(`[${SECTION_OUTLINE_TRIGGER}]`)
	const list = document.getElementById(FALLBACK_LIST_ID)
	if (!trigger || !list) {
		return
	}

	abortController = new AbortController()
	const { signal } = abortController

	trigger.addEventListener('click', (event) => {
		if (sectionOutlineMode() === 'pinned') {
			closeSectionOutline()
			return
		}
		if (openSectionOutline('pinned', event.detail === 0)) {
			trigger.setAttribute('aria-controls', SECTION_OUTLINE_ID)
			return
		}
		trigger.setAttribute('aria-controls', FALLBACK_LIST_ID)
		list.hidden = !list.hidden
		trigger.setAttribute('aria-expanded', String(!list.hidden))
	}, { signal })

	trigger.addEventListener('pointerenter', (event) => {
		if (event.pointerType === 'mouse') {
			openSectionOutline('peek')
		}
	}, { signal })

	trigger.addEventListener('pointerleave', () => {
		if (sectionOutlineMode() === 'peek') {
			closeSectionOutline()
		}
	}, { signal })

	document.addEventListener(SECTION_OUTLINE_CHANGE, (event) => {
		trigger.setAttribute('aria-expanded', String((event as CustomEvent).detail === 'pinned'))
	}, { signal })

	list.addEventListener('click', (event) => {
		const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
		const heading = link && document.getElementById(decodeURIComponent(link.hash.slice(1)))
		if (!heading) {
			return
		}
		event.preventDefault()
		jumpToSection(heading)
		heading.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true })
	}, { signal })
}
