let dispose: (() => void) | null = null

const COPIED_MS = 1600

/** EC stores the tooltip copy in `data-copied` — use a separate flag for the check icon. */
function showCopiedCheck(trigger: HTMLButtonElement) {
	trigger.dataset.copyChecked = ''
	window.setTimeout(() => {
		delete trigger.dataset.copyChecked
	}, COPIED_MS)
}

function bindCopyTrigger(trigger: HTMLButtonElement, signal: AbortSignal) {
	trigger.addEventListener('click', async () => {
		const root = trigger.closest('[data-mdx-pre-root]')
		const code = root?.querySelector('pre code')?.textContent ?? ''
		try {
			await navigator.clipboard.writeText(code)
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

	for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-mdx-pre-copy]'))
		bindCopyTrigger(trigger, signal)

	for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-copy-trigger]'))
		bindCopyTrigger(trigger, signal)

	// Expressive Code copies via its own handler; we only swap the icon to a check briefly.
	for (const trigger of document.querySelectorAll<HTMLButtonElement>('.article-body .expressive-code .copy button'))
		trigger.addEventListener('click', () => showCopiedCheck(trigger), { signal })

	dispose = () => ac.abort()
}
