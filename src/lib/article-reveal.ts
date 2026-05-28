const TOP_SCROLL_PX = 16

export function setupArticleReveal(root: HTMLElement, animate = true) {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
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

	const atTop = window.scrollY <= TOP_SCROLL_PX
	const vh = window.visualViewport?.height ?? window.innerHeight
	const pad = 48

	const revealEl = (el: Element) => {
		el.classList.remove('article-reveal-pending')
		el.classList.add('article-reveal-done')
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					revealEl(e.target)
					io.unobserve(e.target)
				}
			}
		},
		{ root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
	)

	let topRank = 0
	for (const child of [...root.children]) {
		const el = child as HTMLElement
		const r = el.getBoundingClientRect()
		const intersects = r.top < vh + pad && r.bottom > -pad
		const belowFold = r.top > vh - 8
		const aboveViewport = r.bottom < 8

		if (!atTop && intersects) {
			el.classList.add('article-reveal-skip', 'article-reveal-done')
			continue
		}
		if (!atTop && aboveViewport) {
			el.classList.add('article-reveal-skip', 'article-reveal-done')
			continue
		}
		if (!atTop && belowFold) {
			el.classList.add('article-reveal-pending')
			io.observe(el)
			continue
		}

		if (atTop && belowFold) {
			el.classList.add('article-reveal-pending')
			io.observe(el)
			continue
		}

		if (atTop && intersects) {
			el.style.setProperty('--article-reveal-delay', `${topRank * 48}ms`)
			topRank++
			el.classList.add('article-reveal-stagger')
			continue
		}

		el.classList.add('article-reveal-pending')
		io.observe(el)
	}

	/* Remove SSR pending attribute AFTER inline styles/classes are set so children don't flash. */
	root.removeAttribute('data-article-pending')
}

export function initArticleBodies(animate = true) {
	for (const root of document.querySelectorAll<HTMLElement>('[data-article-reveal]'))
		setupArticleReveal(root, animate)
}
