'use client'

import type { ReactNode } from 'react'

import { useLayoutEffect, useRef } from 'react'

import { cn } from '@/lib/cn'

const TOP_SCROLL_PX = 16

interface ArticleRevealClientProps {
	children: ReactNode
	className?: string
}

/**
 * Per-block blur + fade: at scroll top only first-screen blocks stagger; mid-page
 * load shows the viewport immediately; blocks below animate when scrolled into view.
 */
export function ArticleRevealClient({ children, className }: ArticleRevealClientProps) {
	const rootRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const root = rootRef.current
		if (!root)
			return

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduce) {
			for (const el of [...root.children])
				el.classList.add('article-reveal-done')
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
				el.classList.add('article-reveal-skip')
				el.classList.add('article-reveal-done')
				continue
			}
			if (!atTop && aboveViewport) {
				el.classList.add('article-reveal-skip')
				el.classList.add('article-reveal-done')
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

		return () => io.disconnect()
	}, [])

	return (
		<div className={cn('article-body', className)} ref={rootRef}>
			{children}
		</div>
	)
}
