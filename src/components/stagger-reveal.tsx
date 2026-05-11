'use client'

import type { ReactNode } from 'react'

import { Children, isValidElement } from 'react'

import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/cn'

interface StaggerRevealProps {
	/** Blur radius in px when motion is allowed. Default 10 */
	blur?: number
	children: ReactNode
	className?: string
	/** Seconds before the first sibling’s stagger when loading at the top */
	delayChildren?: number
	itemClassName?: string
	/** Seconds between staggered siblings when loading at scroll top */
	staggerChildren?: number
}

/**
 * Wraps each child in {@link Reveal} with a document-order index (top → bottom stagger at scroll top;
 * scroll-in below; instant when the viewport is restored mid-page).
 */
export function StaggerReveal({
	blur = 10,
	children,
	className,
	delayChildren = 0.06,
	itemClassName,
	staggerChildren = 0.052,
}: StaggerRevealProps) {
	return (
		<div className={className}>
			{/* eslint-disable-next-line react/no-children-map -- one Reveal wrapper per child */}
			{Children.map(children, (child, index) => {
				if (!isValidElement(child))
					return null
				return (
					<Reveal
						baseDelay={delayChildren}
						blur={blur}
						className={cn(itemClassName)}
						key={child.key ?? index}
						staggerIndex={index}
						staggerStep={staggerChildren}
					>
						{child}
					</Reveal>
				)
			})}
		</div>
	)
}
