'use client'

import type { HTMLAttributes } from 'react'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

const SPEAKER_PATH
	= 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'

const WAVE_MID = 'M16 9a5 5 0 0 1 0 6'
const WAVE_OUTER = 'M19.364 18.364a9 9 0 0 0 0-12.728'

/** One loop length in seconds (matches previous motion config). */
const CYCLE = 1.45

const MID_T = [0, 0.1, 0.28, 0.48, 0.6, 1] as const
const MID_V = [0, 1, 1, 1, 0, 0] as const
const OUT_T = [0, 0.12, 0.18, 0.28, 0.48, 0.6, 1] as const
const OUT_V = [0, 0, 0, 1, 1, 0, 0] as const

const BOTH_UP = 0.88

function sample(times: readonly number[], values: readonly number[], u: number): number {
	if (u <= times[0]) {
		return values[0]
	}
	const last = times.length - 1
	if (u >= times[last]) {
		return values[last]
	}
	let i = 1
	while (i <= last && u > times[i]) {
		i++
	}
	const t0 = times[i - 1]
	const t1 = times[i]
	const v0 = values[i - 1]
	const v1 = values[i]
	const w = (u - t0) / (t1 - t0)
	return v0 + (v1 - v0) * w
}

function waveOpacities(elapsedSec: number): { mid: number, outer: number } {
	const mod = ((elapsedSec % CYCLE) + CYCLE) % CYCLE
	const u = mod / CYCLE
	return {
		mid: sample(MID_T, MID_V, u),
		outer: sample(OUT_T, OUT_V, u),
	}
}

function bothWavesUp(mid: number, outer: number): boolean {
	return mid >= BOTH_UP && outer >= BOTH_UP
}

interface NameVolumeIconProps extends Omit<HTMLAttributes<SVGSVGElement>, 'children'> {
	audioPlaying: boolean
	endSync: boolean
	onEndSyncComplete?: () => void
	size?: number
}

export function NameVolumeIcon({
	audioPlaying,
	className,
	endSync,
	onEndSyncComplete,
	size = 18,
	...props
}: NameVolumeIconProps) {
	const originMsRef = useRef<null | number>(null)
	const [liveWaves, setLiveWaves] = useState<null | { mid: number, outer: number }>(null)

	const active = audioPlaying || endSync

	/* eslint-disable react/set-state-in-effect -- sync opacity sample when toggling animated mode */
	useLayoutEffect(() => {
		if (!active) {
			setLiveWaves(null)
			return
		}
		if (originMsRef.current === null) {
			originMsRef.current = performance.now()
		}
		const o = originMsRef.current
		setLiveWaves(waveOpacities((performance.now() - o) / 1000))
	}, [active])
	/* eslint-enable react/set-state-in-effect */

	useLayoutEffect(() => {
		if (!(endSync && onEndSyncComplete)) {
			return
		}
		const o = originMsRef.current
		if (o === null) {
			return
		}
		const { mid, outer } = waveOpacities((performance.now() - o) / 1000)
		if (bothWavesUp(mid, outer)) {
			onEndSyncComplete()
		}
	}, [endSync, onEndSyncComplete])

	useEffect(() => {
		if (!active) {
			return
		}
		if (originMsRef.current === null) {
			originMsRef.current = performance.now()
		}

		let id = 0
		const loop = () => {
			const origin = originMsRef.current
			if (origin === null) {
				id = requestAnimationFrame(loop)
				return
			}

			const elapsed = (performance.now() - origin) / 1000
			const { mid, outer } = waveOpacities(elapsed)
			setLiveWaves({ mid, outer })

			if (endSync && bothWavesUp(mid, outer)) {
				onEndSyncComplete?.()
			}

			id = requestAnimationFrame(loop)
		}

		id = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(id)
	}, [active, endSync, onEndSyncComplete])

	if (!active) {
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

	const { mid, outer } = liveWaves ?? { mid: 0, outer: 0 }

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
			<path d={WAVE_MID} style={{ opacity: mid }} />
			<path d={WAVE_OUTER} style={{ opacity: outer }} />
		</svg>
	)
}
