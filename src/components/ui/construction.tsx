'use client'

import type { HTMLAttributes, MouseEvent } from 'react'

import { motion, useAnimation } from 'motion/react'
import { forwardRef, useCallback, useId, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/cn'

export interface ConstructionIconHandle {
	startAnimation: () => void
	stopAnimation: () => void
}

interface ConstructionIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number
}

const ConstructionIcon = forwardRef<ConstructionIconHandle, ConstructionIconProps>(
	({ className, onMouseEnter, onMouseLeave, size = 28, ...props }, ref) => {
		const controls = useAnimation()
		const isControlledRef = useRef(false)
		const stripeId = `construction-stripes-${useId().replace(/:/g, '')}`

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
			(e: MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current)
					void controls.start('animate')
				onMouseEnter?.(e)
			},
			[controls, onMouseEnter],
		)

		const handleMouseLeave = useCallback(
			(e: MouseEvent<HTMLDivElement>) => {
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
					<defs>
						<motion.pattern
							variants={{
								animate: {
									transition: {
										duration: 1,
										ease: 'linear',
										repeat: Number.POSITIVE_INFINITY,
										repeatType: 'loop',
									},
									x: [0, 6],
								},
								normal: {
									x: 0,
								},
							}}
							animate={controls}
							height="14"
							id={stripeId}
							initial="normal"
							patternUnits="userSpaceOnUse"
							width="6"
						>
							<path d="M-4 -2 L14 30" stroke="currentColor" strokeWidth="2" />
						</motion.pattern>
					</defs>
					<rect fill={`url(#${stripeId})`} height="8" rx="1" width="20" x="2" y="6" />
					<path d="M17 14v7" />
					<path d="M7 14v7" />
					<path d="M17 3v3" />
					<path d="M7 3v3" />
				</svg>
			</div>
		)
	},
)

ConstructionIcon.displayName = 'ConstructionIcon'

export { ConstructionIcon }
