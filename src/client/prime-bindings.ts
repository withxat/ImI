import { createAccordion } from '@data-slot/accordion'
import { getRootBinding } from '@data-slot/core'
import { createDialog } from '@data-slot/dialog'
import { createDropdownMenu } from '@data-slot/dropdown-menu'
import { createHoverCard } from '@data-slot/hover-card'
import { createPopover } from '@data-slot/popover'
import { createTooltip } from '@data-slot/tooltip'

// Each Prime UI component vendored under src/components/ui/<x>/<X>.astro ships an
// `<script>` block that calls its create<X>(el) factory once on first paint. Astro
// hoists those scripts as deduped ES modules, so they do NOT re-run after a
// ClientRouter view transition — every Prime widget rendered by the next page
// silently fails to mount (e.g. theme switcher dropdown stops opening).
//
// Each factory also installs a handful of capture listeners on `document`
// (pointerdown / click / keydown for outside-close + escape, plus per-widget
// extras), and those closures hold a strong ref to the original root element.
// If we never tear them down, every navigation accumulates a fresh batch on
// document, slowing global event dispatch and pinning detached DOM forever.
//
// We control the full lifecycle:
//   - astro:before-swap → dispose() walks current roots, looks up each
//     controller via @data-slot/core's getRootBinding, calls destroy().
//   - astro:page-load   → init() runs dispose() first (covers first-paint
//     controllers spawned by Prime's own inline scripts, so reuseRootBinding
//     does not fire its "called more than once" console.warn), then freshly
//     binds every root via createXxx(root).

interface PrimeController {
	destroy?: () => void
}

interface Binding {
	create: (root: Element) => unknown
	key: string
	slot: string
}

const BINDINGS: Binding[] = [
	{ create: createAccordion, key: '@data-slot/accordion', slot: 'accordion' },
	{ create: createDialog, key: '@data-slot/dialog', slot: 'dialog' },
	{ create: createDropdownMenu, key: '@data-slot/dropdown-menu', slot: 'dropdown-menu' },
	{ create: createHoverCard, key: '@data-slot/hover-card', slot: 'hover-card' },
	{ create: createPopover, key: '@data-slot/popover', slot: 'popover' },
	{ create: createTooltip, key: '@data-slot/tooltip', slot: 'tooltip' },
]

export function disposePrimeBindings() {
	for (const { key, slot } of BINDINGS) {
		document.querySelectorAll(`[data-slot="${slot}"]`).forEach((root) => {
			const controller = getRootBinding<PrimeController>(root, key)
			if (!controller?.destroy)
				return

			try {
				controller.destroy()
			}
			catch (error) {
				console.error(`[prime] destroy ${slot} failed`, error)
			}
		})
	}
}

export function initPrimeBindings() {
	disposePrimeBindings()

	for (const { create, slot } of BINDINGS) {
		document.querySelectorAll(`[data-slot="${slot}"]`).forEach((root) => {
			try {
				create(root)
			}
			catch (error) {
				console.error(`[prime] create ${slot} failed`, error)
			}
		})
	}
}
