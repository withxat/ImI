'use client'

import type { NameVolumePhase } from '@/components/name-volume-icon'

import { useCallback, useEffect, useRef, useState } from 'react'

import { NameVolumeIcon } from '@/components/name-volume-icon'
import { Button } from '@/components/ui/button'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [phase, setPhase] = useState<NameVolumePhase>('idle')

	const onFinishingComplete = useCallback(() => {
		setPhase('idle')
	}, [])

	useEffect(() => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		const onPlay = () => setPhase('playing')

		const onEnded = () => {
			setPhase('finishing')
		}

		const onPause = () => {
			if (audio.ended) {
				setPhase('finishing')
				return
			}
			setPhase('idle')
		}

		audio.addEventListener('play', onPlay)
		audio.addEventListener('ended', onEnded)
		audio.addEventListener('pause', onPause)

		return () => {
			audio.removeEventListener('play', onPlay)
			audio.removeEventListener('ended', onEnded)
			audio.removeEventListener('pause', onPause)
		}
	}, [])

	const handlePlay = () => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		audio.currentTime = 0
		void audio.play()
	}

	return (
		<span className="inline-flex items-center">
			<Button
				aria-label="Play name pronunciation"
				className="ml-2 -translate-y-px"
				onClick={handlePlay}
				size="icon-xs"
				type="button"
				variant="ghost"
			>
				<NameVolumeIcon
					onFinishingComplete={onFinishingComplete}
					phase={phase}
					size={16}
					aria-hidden
				/>
			</Button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
