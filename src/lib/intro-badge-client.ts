const OPEN_DELAY = 120
const CLOSE_DELAY = 80

let dispose: (() => void) | null = null

export function initIntroBadges() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac

	for (const root of document.querySelectorAll<HTMLElement>('[data-intro-badge-root]')) {
		const trigger = root.querySelector<HTMLElement>('[data-intro-badge-trigger]')
		const popup = root.querySelector<HTMLElement>('[data-intro-badge-popup]')
		if (!trigger || !popup)
			continue

		let openTimer = 0
		let closeTimer = 0
		let isOpen = false

		const open = () => {
			window.clearTimeout(closeTimer)
			if (isOpen)
				return
			isOpen = true
			popup.classList.remove('hidden')
			trigger.dataset.open = 'true'
		}
		const close = () => {
			window.clearTimeout(openTimer)
			if (!isOpen)
				return
			isOpen = false
			popup.classList.add('hidden')
			delete trigger.dataset.open
		}
		const scheduleOpen = () => {
			window.clearTimeout(closeTimer)
			openTimer = window.setTimeout(open, OPEN_DELAY)
		}
		const scheduleClose = () => {
			window.clearTimeout(openTimer)
			closeTimer = window.setTimeout(close, CLOSE_DELAY)
		}

		trigger.addEventListener('pointerenter', scheduleOpen, { signal })
		trigger.addEventListener('pointerleave', scheduleClose, { signal })
		trigger.addEventListener('focus', open, { signal })
		trigger.addEventListener('blur', close, { signal })
		trigger.addEventListener('click', () => {
			if (isOpen)
				close()
			else open()
		}, { signal })
		trigger.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				if (isOpen)
					close()
				else open()
			}
			else if (e.key === 'Escape') {
				close()
			}
		}, { signal })

		popup.addEventListener('pointerenter', () => window.clearTimeout(closeTimer), { signal })
		popup.addEventListener('pointerleave', scheduleClose, { signal })

		document.addEventListener('pointerdown', (e) => {
			if (!isOpen)
				return
			if (!root.contains(e.target as Node))
				close()
		}, { signal })
	}

	dispose = () => ac.abort()
}
