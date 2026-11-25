import type { Locale } from '@/lib/i18n/constants.ts'

import { codeBlockCopyFor } from '@/lib/i18n/code-block-copy.ts'
import { DEFAULT_LOCALE, isLocale, normalizeStoredLocale } from '@/lib/i18n/constants.ts'

let dispose: (() => void) | null = null

const COPIED_MS = 1600
const SITE_LOCALE_SELECTOR = '[data-site-locale]'

function localeFrom(value: null | string | undefined): Locale | null {
	if (!value)
		return null

	const normalized = normalizeStoredLocale(value.trim().toLowerCase())
	if (isLocale(normalized))
		return normalized

	const base = normalized.split('-')[0]
	return base && isLocale(base) ? base : null
}

function getPageLocale(): Locale {
	const pageLocale = document.querySelector<HTMLElement>(SITE_LOCALE_SELECTOR)?.dataset.siteLocale
	return localeFrom(pageLocale) ?? localeFrom(document.documentElement.lang) ?? DEFAULT_LOCALE
}

function localizeCopyTrigger(trigger: HTMLButtonElement, locale: Locale) {
	const copy = codeBlockCopyFor(locale)
	trigger.title = copy.copyTooltip
	trigger.dataset.copied = copy.copied
	trigger.dataset.copyTooltip = copy.copyTooltip
	trigger.setAttribute('aria-label', copy.copyTooltip)

	const feedback = trigger.parentElement?.querySelector<HTMLElement>('.feedback')
	if (feedback)
		feedback.textContent = copy.copied
}

/** EC stores the tooltip copy in `data-copied` — use a separate flag for the check icon. */
function showCopiedCheck(trigger: HTMLButtonElement) {
	trigger.dataset.copyChecked = ''
	window.setTimeout(() => {
		delete trigger.dataset.copyChecked
	}, COPIED_MS)
}

function showCopiedLabel(trigger: HTMLButtonElement) {
	const copied = trigger.dataset.copied
	if (!copied)
		return

	trigger.title = copied
	trigger.setAttribute('aria-label', copied)
	window.setTimeout(() => {
		const copyTooltip = trigger.dataset.copyTooltip
		if (!copyTooltip)
			return
		trigger.title = copyTooltip
		trigger.setAttribute('aria-label', copyTooltip)
	}, COPIED_MS)
}

function bindCopyTrigger(trigger: HTMLButtonElement, signal: AbortSignal) {
	trigger.addEventListener('click', async () => {
		const root = trigger.closest('[data-mdx-pre-root]')
		const code = root?.querySelector('pre code')?.textContent ?? ''
		try {
			await navigator.clipboard.writeText(code)
			showCopiedLabel(trigger)
			const copyIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="copy"]')
			const checkIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="check"]')
			if (copyIcon && checkIcon) {
				copyIcon.classList.add('hidden')
				checkIcon.classList.remove('hidden')
				window.setTimeout(() => {
					copyIcon.classList.remove('hidden')
					checkIcon.classList.add('hidden')
				}, COPIED_MS)
			}
		}
		catch {}
	}, { signal })
}

function bindHeadingAnchorCopy(signal: AbortSignal, cleanups: Array<() => void>) {
	const links = document.querySelectorAll<HTMLAnchorElement>('.article-body :is(h2, h3)[id] > a[href^="#"]')
	if (links.length === 0)
		return

	let bubble: HTMLSpanElement | null = null
	let timer: ReturnType<typeof setTimeout> | undefined

	const ensureBubble = () => {
		if (bubble && document.contains(bubble))
			return bubble
		bubble = document.createElement('span')
		bubble.className = 'bubble bubble-top bubble-floating'
		bubble.setAttribute('role', 'status')
		bubble.setAttribute('aria-live', 'polite')
		document.body.appendChild(bubble)
		return bubble
	}

	cleanups.push(() => {
		clearTimeout(timer)
		bubble?.remove()
		bubble = null
	})

	for (const link of links) {
		link.addEventListener('click', (event) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				return

			// The link still jumps to its heading as before; copying its URL rides along.
			const copiedText = link.closest<HTMLElement>('[data-link-copied]')?.dataset.linkCopied
			if (!copiedText || !navigator.clipboard)
				return

			navigator.clipboard.writeText(link.href).then(() => {
				const el = ensureBubble()
				el.textContent = copiedText
				const rect = link.getBoundingClientRect()
				const halfW = Math.ceil(el.offsetWidth / 2)
				const margin = 12
				const minX = halfW + margin
				const maxX = Math.max(minX, document.documentElement.clientWidth - halfW - margin)
				const centerX = Math.min(maxX, Math.max(minX, rect.left + rect.width / 2))
				el.style.top = `${rect.top + window.scrollY}px`
				el.style.left = `${centerX}px`
				// Restart pop-in when clicking a second heading while the first bubble is still visible.
				delete el.dataset.shown
				void el.offsetWidth
				el.dataset.shown = ''

				clearTimeout(timer)
				timer = setTimeout(() => {
					delete el.dataset.shown
				}, COPIED_MS)
			}, () => {})
		}, { signal })
	}
}

export function disposeMdxCopyButtons() {
	dispose?.()
	dispose = null
}

export function initMdxCopyButtons() {
	disposeMdxCopyButtons()
	const ac = new AbortController()
	const { signal } = ac
	const cleanups: Array<() => void> = []
	const locale = getPageLocale()

	for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-mdx-pre-copy]')) {
		localizeCopyTrigger(trigger, locale)
		bindCopyTrigger(trigger, signal)
	}

	for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-copy-trigger]')) {
		localizeCopyTrigger(trigger, locale)
		bindCopyTrigger(trigger, signal)
	}

	// Expressive Code copies via its own handler; we only swap the icon to a check briefly.
	for (const trigger of document.querySelectorAll<HTMLButtonElement>('.article-body .expressive-code .copy button')) {
		localizeCopyTrigger(trigger, locale)
		trigger.addEventListener('click', () => showCopiedCheck(trigger), { signal })
	}

	bindHeadingAnchorCopy(signal, cleanups)

	dispose = () => {
		ac.abort()
		for (const cleanup of cleanups)
			cleanup()
	}
}
