import { createPopover } from '@data-slot/popover'

const OPEN_DELAY = 120
const CLOSE_DELAY = 80

let dispose: (() => void) | null = null

export function initIntroBadges() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const controllers: Array<ReturnType<typeof createPopover>> = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-intro-badge-root]')) {
		const trigger = root.querySelector<HTMLElement>('[data-intro-badge-trigger]')
		const popup = root.querySelector<HTMLElement>('[data-intro-badge-popup]')
		if (!trigger || !popup)
			continue

		const controller = createPopover(root)
		controllers.push(controller)

		let openTimer = 0
		let closeTimer = 0
		let focusReturnTarget: HTMLElement | null = null

		const setTriggerOpenState = (open: boolean) => {
			if (open)
				trigger.dataset.open = 'true'
			else delete trigger.dataset.open
		}

		setTriggerOpenState(controller.isOpen)

		const setOpen = (open: boolean) => {
			root.dispatchEvent(new CustomEvent('popover:set', { detail: { open } }))
		}

		const open = () => {
			window.clearTimeout(closeTimer)
			focusReturnTarget = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
				? document.activeElement
				: null
			setOpen(true)
		}

		const close = () => {
			window.clearTimeout(openTimer)
			setOpen(false)
		}

		const scheduleOpen = () => {
			window.clearTimeout(closeTimer)
			openTimer = window.setTimeout(open, OPEN_DELAY)
		}
		const scheduleClose = () => {
			window.clearTimeout(openTimer)
			closeTimer = window.setTimeout(close, CLOSE_DELAY)
		}

		root.addEventListener('popover:change', (event) => {
			const { open } = (event as CustomEvent<{ open: boolean }>).detail

			setTriggerOpenState(open)

			if (!open)
				return

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (!popup.contains(document.activeElement))
						return

					if (focusReturnTarget && document.contains(focusReturnTarget))
						focusReturnTarget.focus({ preventScroll: true })
					else if (document.activeElement instanceof HTMLElement)
						document.activeElement.blur()
				})
			})
		}, { signal })

		if (window.matchMedia('(hover: hover)').matches) {
			trigger.addEventListener('pointerenter', scheduleOpen, { signal })
			trigger.addEventListener('pointerleave', scheduleClose, { signal })
			popup.addEventListener('pointerenter', () => window.clearTimeout(closeTimer), { signal })
			popup.addEventListener('pointerleave', scheduleClose, { signal })
		}
	}

	dispose = () => {
		ac.abort()
		for (const controller of controllers)
			controller.destroy()
	}
}
