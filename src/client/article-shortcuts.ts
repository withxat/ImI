import { SECTION_OUTLINE_TRIGGER } from '@/client/custom-scrollbar'
import { jumpToSection } from '@/client/section-jump'

let abortController: AbortController | null = null

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement))
		return false
	if (target.isContentEditable)
		return true
	const tag = target.tagName
	return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

function hasBlockingOverlay(): boolean {
	return Boolean(
		document.querySelector('.pswp--open, dialog[open], [role="dialog"][data-state="open"]'),
	)
}

function currentSectionIndex(headings: HTMLElement[]): number {
	let current = -1
	for (const [i, heading] of headings.entries()) {
		const margin = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0
		if (heading.getBoundingClientRect().top <= margin + 24)
			current = i
		else
			break
	}
	return current
}

function jumpRelativeSection(delta: -1 | 1) {
	const headings = [...document.querySelectorAll<HTMLElement>('.article-body h2[id]')]
	if (headings.length === 0)
		return

	const current = currentSectionIndex(headings)
	const targetIndex = delta === 1
		? Math.min(headings.length - 1, current + 1)
		: Math.max(0, current - 1)
	const target = headings[targetIndex]
	if (!target)
		return

	jumpToSection(target)
	const focusable = target.querySelector<HTMLElement>('a[href]') ?? (target.tabIndex >= 0 ? target : null)
	focusable?.focus({ preventScroll: true })
}

export function disposeArticleShortcuts() {
	abortController?.abort()
	abortController = null
}

/**
 * Unobtrusive keyboard reading shortcuts on article pages:
 * - `t`: toggle section outline
 * - `j` / `k`: jump to next / previous section (`h2`)
 * - `[` / `]`: navigate to newer / older post
 */
export function initArticleShortcuts() {
	disposeArticleShortcuts()

	if (!document.querySelector('.article-body'))
		return

	abortController = new AbortController()
	const { signal } = abortController

	document.addEventListener('keydown', (event) => {
		if (
			event.defaultPrevented
			|| event.metaKey
			|| event.ctrlKey
			|| event.altKey
			|| event.isComposing
			|| isEditableTarget(event.target)
			|| hasBlockingOverlay()
		) {
			return
		}

		if (event.key === 't') {
			const trigger = document.querySelector<HTMLButtonElement>(`[${SECTION_OUTLINE_TRIGGER}]`)
			if (!trigger)
				return
			event.preventDefault()
			trigger.click()
			return
		}

		if (event.key === 'j' || event.key === 'k') {
			event.preventDefault()
			jumpRelativeSection(event.key === 'j' ? 1 : -1)
			return
		}

		if (event.key === '[' || event.key === ']') {
			const direction = event.key === '[' ? 'newer' : 'older'
			const link = document.querySelector<HTMLAnchorElement>(`a[data-post-nav="${direction}"]`)
			if (!link)
				return
			event.preventDefault()
			link.click()
		}
	}, { signal })
}
