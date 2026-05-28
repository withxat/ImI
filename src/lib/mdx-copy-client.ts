let dispose: (() => void) | null = null

function bindCopyTrigger(trigger: HTMLButtonElement, signal: AbortSignal) {
	trigger.addEventListener('click', async () => {
		const caption = trigger.closest('[data-mdx-pretty-caption]')
		const figure = caption?.closest('figure')
		const root = trigger.closest('[data-mdx-pre-root]') ?? figure
		const code = root?.querySelector('pre code')?.textContent ?? ''
		try {
			await navigator.clipboard.writeText(code)
			const copyIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="copy"]')
			const checkIcon = trigger.querySelector<HTMLElement>('[data-copy-icon="check"]')
			copyIcon?.classList.add('hidden')
			checkIcon?.classList.remove('hidden')
			setTimeout(() => {
				copyIcon?.classList.remove('hidden')
				checkIcon?.classList.add('hidden')
			}, 1600)
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

	dispose = () => ac.abort()
}
