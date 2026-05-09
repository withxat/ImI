'use client'

import type { HTMLAttributes } from 'react'

import { motion } from 'motion/react'
import { useEffect } from 'react'

import { cn } from '@/lib/cn'

const NAME_VOLUME_FINISH_MS = 820

const SPEAKER_PATH
	= 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'

const WAVE_MID = 'M16 9a5 5 0 0 1 0 6'
const WAVE_OUTER = 'M19.364 18.364a9 9 0 0 0 0-12.728'

const CYCLE = 1.45

export type NameVolumePhase = 'finishing' | 'idle' | 'playing'

interface NameVolumeIconProps extends Omit<HTMLAttributes<SVGSVGElement>, 'children'> {
	onFinishingComplete?: () => void
	phase: NameVolumePhase
	size?: number
}

export function NameVolumeIcon({
	className,
	onFinishingComplete,
	phase,
	size = 18,
	...props
}: NameVolumeIconProps) {
	useEffect(() => {
		if (phase !== 'finishing' || !onFinishingComplete) {
			return
		}
		const id = window.setTimeout(() => {
			onFinishingComplete()
		}, NAME_VOLUME_FINISH_MS)
		return () => window.clearTimeout(id)
	}, [phase, onFinishingComplete])

	if (phase === 'idle') {
		return (
			<svg
				className={cn('shrink-0', className)}
				fill="none"
				height={size}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				width={size}
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path d={SPEAKER_PATH} />
				<path d={WAVE_MID} />
				<path d={WAVE_OUTER} />
			</svg>
		)
	}

	if (phase === 'finishing') {
		const ease = 'easeInOut' as const
		const d = NAME_VOLUME_FINISH_MS / 1000
		return (
			<svg
				className={cn('shrink-0', className)}
				fill="none"
				height={size}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				width={size}
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path d={SPEAKER_PATH} />
				<motion.path
					animate={{ opacity: [0, 1, 1] }}
					d={WAVE_MID}
					initial={{ opacity: 0 }}
					transition={{ duration: d, ease, times: [0, 0.28, 1] }}
				/>
				<motion.path
					animate={{ opacity: [0, 0, 1, 1] }}
					d={WAVE_OUTER}
					initial={{ opacity: 0 }}
					transition={{ duration: d, ease, times: [0, 0.22, 0.4, 1] }}
				/>
			</svg>
		)
	}

	// playing — loop: first mid, then outer, then both dip before repeat
	return (
		<svg
			className={cn('shrink-0', className)}
			fill="none"
			height={size}
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d={SPEAKER_PATH} />
			<motion.path
				animate={{
					opacity: [0, 1, 1, 1, 0, 0],
					transition: {
						duration: CYCLE,
						ease: 'easeInOut',
						repeat: Infinity,
						times: [0, 0.1, 0.28, 0.48, 0.6, 1],
					},
				}}
				d={WAVE_MID}
			/>
			<motion.path
				animate={{
					opacity: [0, 0, 0, 1, 1, 0, 0],
					transition: {
						duration: CYCLE,
						ease: 'easeInOut',
						repeat: Infinity,
						times: [0, 0.12, 0.18, 0.28, 0.48, 0.6, 1],
					},
				}}
				d={WAVE_OUTER}
			/>
		</svg>
	)
}
