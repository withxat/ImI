'use client'

import type { Variants } from 'motion/react'
import type { HTMLAttributes, Ref } from 'react'

import { motion } from 'motion/react'
import { useCallback, useImperativeHandle, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

export interface ArrowUpRightIconHandle {
	startAnimation: () => void
	stopAnimation: () => void
}

interface ArrowUpRightIconProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<ArrowUpRightIconHandle>
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

function ArrowUpRightIcon({
	className,
	onMouseEnter,
	onMouseLeave,
	ref,
	size = 28,
	...props
}: ArrowUpRightIconProps) {
	const [animation, setAnimation] = useState<'animate' | 'normal'>('normal')
	const isControlledRef = useRef(false)

	useImperativeHandle(ref, () => {
		isControlledRef.current = true
		return {
			startAnimation: () => {
				setAnimation('animate')
			},
			stopAnimation: () => {
				setAnimation('normal')
			},
		}
	})

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isControlledRef.current)
				setAnimation('animate')
			onMouseEnter?.(e)
		},
		[onMouseEnter],
	)

	const handleMouseLeave = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isControlledRef.current)
				setAnimation('normal')
			onMouseLeave?.(e)
		},
		[onMouseLeave],
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
				<motion.g animate={animation} initial="normal" variants={ARROW_VARIANTS}>
					<path d="M7 7h10v10" />
					<path d="M7 17 17 7" />
				</motion.g>
			</svg>
		</div>
	)
}

ArrowUpRightIcon.displayName = 'ArrowUpRightIcon'

export { ArrowUpRightIcon }
