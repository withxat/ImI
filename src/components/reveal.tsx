'use client'

import type { ReactNode } from 'react'

import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

/** Scroll restoration / mid-page load: treat as "not top" above this offset. */
const TOP_SCROLL_PX = 16

export type RevealMode = 'instant' | 'scroll' | 'stagger'

interface RevealProps {
	/** Extra delay (s) before this sibling’s stagger when loading at the top */
	baseDelay?: number
	/** Blur radius in px when motion is allowed */
	blur?: number
	children: ReactNode
	className?: string
	/** Document-order index among siblings for top-of-page stagger */
	staggerIndex?: number
	/** Seconds between staggered siblings when loading at scroll top */
	staggerStep?: number
}

/**
 * Blur + opacity entrance without pulling a runtime animation library into the
 * first page load. Initial viewport items stagger; below-fold items reveal once.
 */
export function Reveal({
	baseDelay = 0.06,
	blur = 10,
	children,
	className,
	staggerIndex,
	staggerStep = 0.048,
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [mode, setMode] = useState<null | RevealMode>(null)
	const [visible, setVisible] = useState(false)

	/* eslint-disable react/set-state-in-effect -- layout reads scroll + geometry before paint */
	useLayoutEffect(() => {
		const el = ref.current
		if (!el)
			return

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const atTop = window.scrollY <= TOP_SCROLL_PX
		const r = el.getBoundingClientRect()
		const vh = window.visualViewport?.height ?? window.innerHeight
		const pad = 48
		const intersects = r.top < vh + pad && r.bottom > -pad
		const belowFold = r.top > vh - 8
		const aboveViewport = r.bottom < 8

		if (reduceMotion || (!atTop && (intersects || aboveViewport))) {
			setMode('instant')
			setVisible(true)
			return
		}

		if ((atTop && belowFold) || (!atTop && belowFold)) {
			setMode('scroll')
			return
		}

		if (atTop && intersects) {
			setMode('stagger')
			requestAnimationFrame(() => setVisible(true))
			return
		}

		setMode('scroll')
	}, [])
	/* eslint-enable react/set-state-in-effect */

	useLayoutEffect(() => {
		const el = ref.current
		if (mode !== 'scroll' || !el)
			return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting)
					return
				setVisible(true)
				observer.disconnect()
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [mode])

	const delay
		= mode === 'stagger'
			? baseDelay + (staggerIndex ?? 0) * staggerStep
			: 0
	const shouldBlur = mode !== 'instant' && !visible

	return (
		<div
			style={{
				filter: shouldBlur ? `blur(${blur}px)` : 'blur(0px)',
				opacity: visible ? 1 : 0,
				transitionDelay: visible && delay ? `${delay}s` : undefined,
				transitionDuration: mode === 'instant' ? '0ms' : '420ms',
				transitionProperty: 'opacity, filter',
				transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
			}}
			className={cn(className)}
			ref={ref}
		>
			{children}
		</div>
	)
}
