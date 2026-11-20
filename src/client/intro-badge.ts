let dispose: (() => void) | null = null

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

function tabbablesIn(scope: Document | HTMLElement) {
	return [...scope.querySelectorAll<HTMLElement>(TABBABLE)].filter(el => el.getClientRects().length > 0)
}

export function initIntroBadges() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const roots: HTMLElement[] = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-intro-badge-root]')) {
		roots.push(root)
		const trigger = root.querySelector<HTMLElement>('[data-intro-badge-trigger]')
		if (!trigger)
			continue

		const canHover = matchMedia('(hover: hover) and (pointer: fine)')
		let focusReturnTarget: HTMLElement | null = null
		let popup: HTMLElement | null = null

		// The card is portaled to the end of <body>, so the browser's Tab order skips
		// it. Bridge it in: badge → links in the card → whatever follows the badge.
		const onPopupKeydown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab' || !popup)
				return
			const inside = tabbablesIn(popup)
			if (document.activeElement !== (event.shiftKey ? inside[0] : inside.at(-1)))
				return
			event.preventDefault()
			if (event.shiftKey) {
				trigger.focus()
				return
			}
			const outside = tabbablesIn(document).filter(el => !popup?.contains(el))
			outside[outside.indexOf(trigger) + 1]?.focus()
		}

		const setTriggerOpenState = (open: boolean) => {
			if (open)
				trigger.dataset.open = 'true'
			else delete trigger.dataset.open
		}

		// The hover card mounts its content (portaled to <body>) only while open,
		// so the popup comes from the event rather than a lookup at init.
		root.addEventListener('hover-card:change', (event) => {
			const { content, open } = (event as CustomEvent<{ content: HTMLElement, open: boolean }>).detail

			if (popup !== content) {
				popup = content
				popup.addEventListener('keydown', onPopupKeydown, { signal })
			}
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
					if (!content.contains(document.activeElement))
						return

					if (focusReturnTarget && document.contains(focusReturnTarget))
						focusReturnTarget.focus({ preventScroll: true })
					else if (document.activeElement instanceof HTMLElement)
						document.activeElement.blur()
				})
			})
		}, { signal })

		trigger.addEventListener('keydown', (event) => {
			const first = popup && tabbablesIn(popup)[0]
			if (event.key !== 'Tab' || event.shiftKey || !root.hasAttribute('data-open') || !first)
				return
			event.preventDefault()
			first.focus()
		}, { signal })

		trigger.addEventListener('click', (event) => {
			if (canHover.matches)
				return

			event.preventDefault()
			event.stopPropagation()
			root.dispatchEvent(new CustomEvent('hover-card:set', {
				bubbles: true,
				detail: { open: !root.hasAttribute('data-open') },
			}))
		}, { signal })

		root.addEventListener('pointerenter', () => {
			focusReturnTarget = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
				? document.activeElement
				: null
		}, { signal })
	}

	dispose = () => ac.abort()
}
