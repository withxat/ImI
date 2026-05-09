'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { NameVolumeIcon } from '@/components/name-volume-icon'
import { Button } from '@/components/ui/button'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [playing, setPlaying] = useState(false)
	const [endSync, setEndSync] = useState(false)

	const onEndSyncComplete = useCallback(() => {
		setEndSync(false)
	}, [])

	useEffect(() => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		const onPlay = () => {
			setPlaying(true)
			setEndSync(false)
		}

		const onEnded = () => {
			setPlaying(false)
			setEndSync(true)
		}

		const onPause = () => {
			if (audio.ended) {
				setPlaying(false)
				setEndSync(true)
				return
			}
			setPlaying(false)
			setEndSync(false)
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
					audioPlaying={playing}
					endSync={endSync}
					onEndSyncComplete={onEndSyncComplete}
					size={16}
					aria-hidden
				/>
			</Button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
