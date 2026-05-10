'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'

import { motion, useReducedMotion } from 'motion/react'
import { Children, isValidElement, useMemo } from 'react'

import { cn } from '@/lib/cn'

const easeOut = [0.22, 1, 0.36, 1] as const

interface StaggerRevealProps {
	/** Blur radius in px when motion is allowed. Default 10 */
	blur?: number
	children: ReactNode
	className?: string
	/** Seconds before the first sibling animates. Default 0.06 */
	delayChildren?: number
	itemClassName?: string
	/** Seconds between siblings (DOM order ≈ top → bottom). Default 0.052 */
	staggerChildren?: number
}

/**
 * Blur + opacity entrance, staggered in **DOM order** (usually top → bottom).
 * Children must be elements you want as separate steps (wrap lists in fragments sparingly).
 */
export function StaggerReveal({
	blur = 10,
	children,
	className,
	delayChildren = 0.06,
	itemClassName,
	staggerChildren = 0.052,
}: StaggerRevealProps) {
	const reduceMotion = useReducedMotion()

	const { container, item } = useMemo(() => {
		if (reduceMotion) {
			const containerVariants: Variants = {
				hidden: {},
				visible: {
					transition: {
						delayChildren: 0,
						staggerChildren: 0.02,
					},
				},
			}
			const itemVariants: Variants = {
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: { duration: 0.2 },
				},
			}
			return { container: containerVariants, item: itemVariants }
		}
		const containerVariants: Variants = {
			hidden: {},
			visible: {
				transition: {
					delayChildren,
					staggerChildren,
				},
			},
		}
		const itemVariants: Variants = {
			hidden: {
				filter: `blur(${blur}px)`,
				opacity: 0,
			},
			visible: {
				filter: 'blur(0px)',
				opacity: 1,
				transition: {
					duration: 0.42,
					ease: easeOut,
				},
			},
		}
		return { container: containerVariants, item: itemVariants }
	}, [blur, delayChildren, reduceMotion, staggerChildren])

	return (
		<motion.div
			animate="visible"
			className={className}
			initial="hidden"
			variants={container}
		>
			{/* eslint-disable-next-line react/no-children-map -- stagger wraps each valid element child */}
			{Children.map(children, (child, index) => {
				if (!isValidElement(child))
					return null
				return (
					<motion.div
						className={cn(itemClassName)}
						key={child.key ?? index}
						variants={item}
					>
						{child}
					</motion.div>
				)
			})}
		</motion.div>
	)
}
