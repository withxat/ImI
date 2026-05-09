'use client'

import { useEffect, useRef, useState } from 'react'

import { NameVolumeIcon } from '@/components/name-volume-icon'
import { Button } from '@/components/ui/button'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [playing, setPlaying] = useState(false)

	useEffect(() => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		const onPlay = () => setPlaying(true)
		const onStop = () => setPlaying(false)

		audio.addEventListener('play', onPlay)
		audio.addEventListener('ended', onStop)
		audio.addEventListener('pause', onStop)

		return () => {
			audio.removeEventListener('play', onPlay)
			audio.removeEventListener('ended', onStop)
			audio.removeEventListener('pause', onStop)
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
				<NameVolumeIcon playing={playing} size={16} aria-hidden />
			</Button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
