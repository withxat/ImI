'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { NameVolumeIcon } from '@/components/name-volume-icon'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [playing, setPlaying] = useState(false)
	const [endSync, setEndSync] = useState(false)
	const [showPronunciation, setShowPronunciation] = useState(false)

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

		setShowPronunciation(true)
		audio.currentTime = 0
		void audio.play()
	}

	return (
		<span className="inline-flex items-baseline gap-0.75">
			{showPronunciation && (
				<span className="
					inline-flex -translate-y-0.75 text-sm whitespace-nowrap text-highlight-strong
					sm:text-base
				"
				>
					/ˈeɪtoʊ/
				</span>
			)}
			<button
				className="
					relative inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors
					outline-none
					hover:bg-accent
					focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background
					sm:size-6
				"
				aria-label="Play name pronunciation"
				onClick={handlePlay}
				type="button"
			>
				<NameVolumeIcon
					audioPlaying={playing}
					className="size-3.5"
					endSync={endSync}
					onEndSyncComplete={onEndSyncComplete}
					aria-hidden
				/>
			</button>
			<audio preload="none" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
