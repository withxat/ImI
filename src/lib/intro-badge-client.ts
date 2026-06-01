let dispose: (() => void) | null = null

export function initIntroBadges() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const roots: HTMLElement[] = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-intro-badge-root]')) {
		roots.push(root)
		const trigger = root.querySelector<HTMLElement>('[data-intro-badge-trigger]')
		const popup = root.querySelector<HTMLElement>('[data-intro-badge-popup]')
		if (!trigger || !popup)
			continue

		let focusReturnTarget: HTMLElement | null = null

		const setTriggerOpenState = (open: boolean) => {
			if (open)
				trigger.dataset.open = 'true'
			else delete trigger.dataset.open
		}

		root.addEventListener('hover-card:change', (event) => {
			const { open } = (event as CustomEvent<{ open: boolean }>).detail

			setTriggerOpenState(open)

			if (!open)
				return

			for (const other of roots) {
				if (other !== root) {
					other.dispatchEvent(new CustomEvent('hover-card:set', {
						bubbles: true,
						detail: { open: false },
					}))
				}
			}

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

		root.addEventListener('pointerenter', () => {
			focusReturnTarget = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
				? document.activeElement
				: null
		}, { signal })
	}

	dispose = () => ac.abort()
}
