import {
	classifyRevealPosition,
	createScrollObserver,
	prefersReducedMotion,
} from '@/lib/reveal-engine'

export function setupArticleReveal(root: HTMLElement, animate = true) {
	const reduce = prefersReducedMotion()

	if (reduce) {
		for (const el of [...root.children])
			el.classList.add('article-reveal-done')
		root.removeAttribute('data-article-pending')
		return
	}

	if (!animate) {
		for (const el of [...root.children])
			el.classList.add('article-reveal-skip', 'article-reveal-done')
		root.removeAttribute('data-article-pending')
		return
	}

	const io = createScrollObserver(
		(el) => {
			el.classList.remove('article-reveal-pending')
			el.classList.add('article-reveal-done')
			io.unobserve(el)
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
	)

	let topRank = 0
	for (const child of [...root.children]) {
		const el = child as HTMLElement
		const rect = el.getBoundingClientRect()
		const strategy = classifyRevealPosition(rect, animate, reduce)

		switch (strategy) {
			case 'skip':
				el.classList.add('article-reveal-skip', 'article-reveal-done')
				break

			case 'stagger':
				el.style.setProperty('--article-reveal-delay', `${topRank * 48}ms`)
				topRank++
				el.classList.add('article-reveal-stagger')
				break

			case 'observe':
				el.classList.add('article-reveal-pending')
				io.observe(el)
				break

			case 'instant':
			default:
				el.classList.add('article-reveal-skip', 'article-reveal-done')
				break
		}
	}

	/* Remove SSR pending attribute AFTER inline styles/classes are set so children don't flash. */
	root.removeAttribute('data-article-pending')
}

export function initArticleBodies(animate = true) {
	for (const root of document.querySelectorAll<HTMLElement>('[data-article-reveal]'))
		setupArticleReveal(root, animate)
}
