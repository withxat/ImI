let dispose: (() => void) | null = null

function showCopied(trigger: HTMLButtonElement) {
	trigger.dataset.copied = 'true'
	window.setTimeout(() => {
		delete trigger.dataset.copied
	}, 1600)
}

function bindCopyTrigger(trigger: HTMLButtonElement, signal: AbortSignal) {
	trigger.addEventListener('click', async () => {
		const root = trigger.closest('[data-mdx-pre-root]') ?? trigger.closest('.expressive-code')
		const code = root?.querySelector('pre code')?.textContent ?? ''
		try {
			await navigator.clipboard.writeText(code)
			showCopied(trigger)

			const copyIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="copy"]')
			const checkIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="check"]')
			if (copyIcon && checkIcon) {
				copyIcon.classList.add('hidden')
				checkIcon.classList.remove('hidden')
				window.setTimeout(() => {
					copyIcon.classList.remove('hidden')
					checkIcon.classList.add('hidden')
				}, 1600)
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

	// Expressive Code ships its own copy handler; we only add the check icon feedback.
	for (const trigger of document.querySelectorAll<HTMLButtonElement>('.article-body .expressive-code .copy button')) {
		trigger.addEventListener('click', () => showCopied(trigger), { signal })
	}

	dispose = () => ac.abort()
}
