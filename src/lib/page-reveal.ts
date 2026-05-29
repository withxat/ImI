import {
	classifyRevealPosition,
	createScrollObserver,
	initRevealHidden,
	prefersReducedMotion,
	revealElement,
} from '@/lib/reveal-engine'

export interface PageRevealOptions {
	/** When false, show content immediately (client navigations). */
	animate?: boolean
}

function initRevealElement(el: HTMLElement, animate: boolean) {
	const baseDelay = Number(el.dataset.revealBaseDelay ?? 0.06)
	const blur = Number(el.dataset.revealBlur ?? 10)
	const idx = Number(el.dataset.revealStaggerIndex ?? 0)
	const step = Number(el.dataset.revealStaggerStep ?? 0.048)

	el.style.setProperty('--reveal-blur', `${blur}px`)

	const rect = el.getBoundingClientRect()
	const strategy = classifyRevealPosition(rect, animate, prefersReducedMotion())

	switch (strategy) {
		case 'skip':
			revealElement(el, { instant: true })
			break

		case 'stagger': {
			const delay = baseDelay + idx * step
			initRevealHidden(el, blur)
			requestAnimationFrame(() => revealElement(el, { instant: false }))
			el.style.transitionDelay = `${delay}s`
			break
		}

		case 'observe': {
			initRevealHidden(el, blur)
			const io = createScrollObserver((observedEl) => {
				revealElement(observedEl, { instant: false })
				io.unobserve(observedEl)
			})
			io.observe(el)
			break
		}

		case 'instant':
		default:
			revealElement(el, { instant: true })
			break
	}
}

export function initStaggerRoot(root: HTMLElement, animate: boolean) {
	const blur = Number(root.dataset.staggerBlur ?? 10)
	const baseDelay = Number(root.dataset.staggerDelay ?? 0.06)
	const step = Number(root.dataset.staggerStep ?? 0.052)
	const itemClass = root.dataset.staggerItemClass ?? ''

	const reduce = prefersReducedMotion()
	const children = [...root.children] as HTMLElement[]

	children.forEach((child, index) => {
		if (itemClass)
			child.classList.add(...itemClass.split(/\s+/).filter(Boolean))

		child.style.transitionProperty = 'opacity, filter'
		child.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)'

		const rect = child.getBoundingClientRect()
		const strategy = classifyRevealPosition(rect, animate, reduce)

		switch (strategy) {
			case 'skip':
				revealElement(child, { instant: true })
				break

			case 'stagger': {
				const delay = baseDelay + index * step
				child.style.opacity = '0'
				child.style.filter = `blur(${blur}px)`
				requestAnimationFrame(() => {
					child.style.transitionDelay = `${delay}s`
					revealElement(child, { instant: false })
				})
				break
			}

			case 'observe': {
				child.style.opacity = '0'
				child.style.filter = `blur(${blur}px)`
				const io = createScrollObserver((observedEl) => {
					revealElement(observedEl, { instant: false })
					io.unobserve(observedEl)
				})
				io.observe(child)
				break
			}

			case 'instant':
			default:
				revealElement(child, { instant: true })
				break
		}
	})

	/* Remove SSR pending attribute AFTER inline styles are set so children don't flash. */
	root.removeAttribute('data-stagger-pending')
}

export function initPageReveals({ animate = true }: PageRevealOptions = {}) {
	for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]'))
		initRevealElement(el, animate)

	for (const root of document.querySelectorAll<HTMLElement>('[data-stagger-reveal]'))
		initStaggerRoot(root, animate)
}
