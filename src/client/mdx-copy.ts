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

export function initMdxCopyButtons() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
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

	dispose = () => ac.abort()
}
