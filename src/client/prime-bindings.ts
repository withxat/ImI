import { getRootBinding } from '@data-slot/core'
import { createDropdownMenu } from '@data-slot/dropdown-menu'

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
//
// Only `dropdown-menu` (header theme switcher) is imported eagerly; page-specific
// widgets (`hover-card` on `/`, `accordion` in MDX posts) load on demand when
// matching DOM slots exist so other pages do not ship their code.

interface PrimeController {
	destroy?: () => void
}

type PrimeFactory = (root: Element) => unknown

interface SyncBinding {
	create: PrimeFactory
	key: string
	slot: string
}

interface LazyBinding {
	key: string
	load: () => Promise<PrimeFactory>
	slot: string
}

const SYNC_BINDINGS: SyncBinding[] = [
	{ create: createDropdownMenu, key: '@data-slot/dropdown-menu', slot: 'dropdown-menu' },
]

const LAZY_BINDINGS: LazyBinding[] = [
	{
		key: '@data-slot/accordion',
		load: () => import('@data-slot/accordion').then(m => m.createAccordion),
		slot: 'accordion',
	},
	{
		key: '@data-slot/hover-card',
		load: () => import('@data-slot/hover-card').then(m => m.createHoverCard),
		slot: 'hover-card',
	},
]

const ALL_SLOTS = [...SYNC_BINDINGS, ...LAZY_BINDINGS]

let generation = 0

function bindRoot(slot: string, create: PrimeFactory, root: Element) {
	try {
		create(root)
	}
	catch (error) {
		console.error(`[prime] create ${slot} failed`, error)
	}
}

export function disposePrimeBindings() {
	generation++

	for (const { key, slot } of ALL_SLOTS) {
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
	const currentGeneration = generation

	for (const { create, slot } of SYNC_BINDINGS) {
		document.querySelectorAll(`[data-slot="${slot}"]`).forEach(root => bindRoot(slot, create, root))
	}

	for (const { load, slot } of LAZY_BINDINGS) {
		const roots = [...document.querySelectorAll(`[data-slot="${slot}"]`)]
		if (roots.length === 0)
			continue

		void load().then((create) => {
			if (generation !== currentGeneration)
				return

			for (const root of roots) {
				if (root.isConnected)
					bindRoot(slot, create, root)
			}
		})
	}
}
