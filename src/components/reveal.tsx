'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'

import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

const easeOut = [0.22, 1, 0.36, 1] as const

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
 * Subtle y-axis entrance (opacity stays 1 so text can paint for LCP). Behaviour:
 * - **At scroll top**: in-viewport blocks stagger top → bottom; below-fold blocks animate on scroll into view.
 * - **Mid-page (e.g. refresh while scrolled)**: whatever is in the viewport is shown immediately; below gets scroll-in; above is final.
 */
export function Reveal({
	baseDelay = 0.06,
	blur = 10,
	children,
	className,
	staggerIndex,
	staggerStep = 0.048,
}: RevealProps) {
	const reduceMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement>(null)
	const [mode, setMode] = useState<null | RevealMode>(null)

	const variants: Variants = useMemo(() => {
		if (reduceMotion) {
			return {
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: { duration: 0.2 },
				},
			}
		}
		return {
			hidden: {
				opacity: 1,
				y: 8 + Math.round(blur * 0.5),
			},
			visible: {
				opacity: 1,
				transition: {
					duration: 0.42,
					ease: easeOut,
				},
				y: 0,
			},
		}
	}, [blur, reduceMotion])

	/* eslint-disable react/set-state-in-effect -- layout reads scroll + geometry; mode must be set before paint */
	useLayoutEffect(() => {
		const el = ref.current
		if (!el)
			return

		const atTop = window.scrollY <= TOP_SCROLL_PX
		const r = el.getBoundingClientRect()
		const vh = window.visualViewport?.height ?? window.innerHeight
		const pad = 48
		const intersects = r.top < vh + pad && r.bottom > -pad
		const belowFold = r.top > vh - 8
		const aboveViewport = r.bottom < 8

		if (!atTop && intersects) {
			setMode('instant')
			return
		}
		if (!atTop && aboveViewport) {
			setMode('instant')
			return
		}
		if (!atTop && belowFold) {
			setMode('scroll')
			return
		}

		if (atTop && belowFold) {
			setMode('scroll')
			return
		}

		if (atTop && intersects) {
			setMode('stagger')
			return
		}

		setMode('scroll')
	}, [])
	/* eslint-enable react/set-state-in-effect */

	const staggerDelay
		= mode === 'stagger'
			? baseDelay + (staggerIndex ?? 0) * staggerStep
			: 0

	if (mode === null) {
		return (
			<div
				className={cn(className, reduceMotion ? 'opacity-100' : 'translate-y-2 opacity-100')}
				ref={ref}
			>
				{children}
			</div>
		)
	}

	if (mode === 'instant') {
		return (
			<motion.div
				animate="visible"
				className={className}
				initial={false}
				ref={ref}
				transition={{ duration: 0 }}
				variants={variants}
			>
				{children}
			</motion.div>
		)
	}

	if (mode === 'stagger') {
		return (
			<motion.div
				transition={{
					delay: staggerDelay,
					duration: reduceMotion ? 0.2 : 0.42,
					ease: easeOut,
				}}
				animate="visible"
				className={className}
				initial="hidden"
				ref={ref}
				variants={variants}
			>
				{children}
			</motion.div>
		)
	}

	return (
		<motion.div
			className={className}
			initial="hidden"
			ref={ref}
			transition={{ duration: reduceMotion ? 0.2 : 0.42, ease: easeOut }}
			variants={variants}
			viewport={{ amount: 0.14, margin: '0px 0px -10% 0px', once: true }}
			whileInView="visible"
		>
			{children}
		</motion.div>
	)
}
