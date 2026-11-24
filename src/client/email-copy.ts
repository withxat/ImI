/**
 * The copy button that grows after the footer's Email link (`.email-copy` in globals.css). The link
 * itself stays a plain mailto:. A click copies the address and says so in a bubble; `data-copied`
 * keeps the button out until the bubble leaves. Without the Clipboard API the button never shows.
 */
const SHOWN_MS = 1600

let dispose: (() => void) | null = null

export function initEmailCopy() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const cleanups: Array<() => void> = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-email-copy]')) {
		const slot = root.querySelector<HTMLElement>('[data-email-copy-slot]')
		const button = root.querySelector<HTMLButtonElement>('[data-email-copy-button]')
		const bubble = root.querySelector<HTMLElement>('[data-email-copy-bubble]')
		const address = root.dataset.emailCopy
		if (!slot || !button || !bubble || !address)
			continue
		if (!navigator.clipboard) {
			slot.hidden = true
			continue
		}

		let timer: ReturnType<typeof setTimeout> | undefined
		cleanups.push(() => clearTimeout(timer))

		button.addEventListener('click', () => {
			navigator.clipboard.writeText(address).then(() => {
				bubble.textContent = bubble.dataset.copiedLabel ?? ''
				bubble.dataset.shown = ''
				root.dataset.copied = ''
				clearTimeout(timer)
				timer = setTimeout(() => {
					delete bubble.dataset.shown
					delete root.dataset.copied
				}, SHOWN_MS)
			}, () => {})
		}, { signal })
	}

	dispose = () => {
		ac.abort()
		for (const cleanup of cleanups)
			cleanup()
	}
}
