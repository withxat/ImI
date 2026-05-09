'use client'

import type { Variants } from 'motion/react'
import type { HTMLAttributes } from 'react'

import { motion, useAnimation } from 'motion/react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/cn'

export interface ArrowUpRightIconHandle {
	startAnimation: () => void
	stopAnimation: () => void
}

interface ArrowUpRightIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number
}

const ARROW_VARIANTS: Variants = {
	animate: {
		originX: 1,
		originY: 0,
		scale: [1, 0.85, 1],
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
		},
		translateX: [0, -4, 0],
		translateY: [0, 4, 0],
	},
	normal: {
		scale: 1,
		translateX: 0,
		translateY: 0,
	},
}

const ArrowUpRightIcon = forwardRef<ArrowUpRightIconHandle, ArrowUpRightIconProps>(
	({ className, onMouseEnter, onMouseLeave, size = 28, ...props }, ref) => {
		const controls = useAnimation()
		const isControlledRef = useRef(false)

		useImperativeHandle(ref, () => {
			isControlledRef.current = true
			return {
				startAnimation: () => {
					void controls.start('animate')
				},
				stopAnimation: () => {
					void controls.start('normal')
				},
			}
		})

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current)
					void controls.start('animate')
				onMouseEnter?.(e)
			},
			[controls, onMouseEnter],
		)

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current)
					void controls.start('normal')
				onMouseLeave?.(e)
			},
			[controls, onMouseLeave],
		)

		return (
			<div
				className={cn('inline-flex shrink-0 text-current', className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<motion.g animate={controls} initial="normal" variants={ARROW_VARIANTS}>
						<path d="M7 7h10v10" />
						<path d="M7 17 17 7" />
					</motion.g>
				</svg>
			</div>
		)
	},
)

ArrowUpRightIcon.displayName = 'ArrowUpRightIcon'

export { ArrowUpRightIcon }
