'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { NameVolumeIcon } from '@/components/name-volume-icon'
import { Button } from '@/components/ui/button'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [playing, setPlaying] = useState(false)
	const [endSync, setEndSync] = useState(false)
	const [showPronunciation, setShowPronunciation] = useState(false)
	const reduceMotion = useReducedMotion()

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
			<AnimatePresence initial={false}>
				{showPronunciation && (
					<motion.span
						animate={{
							opacity: 1,
							width: 'auto',
						}}
						className="
							inline-flex -translate-y-0.75 overflow-hidden text-sm whitespace-nowrap text-highlight-strong
							sm:text-base
						"
						exit={{
							opacity: 0,
							width: 0,
						}}
						initial={reduceMotion
							? false
							: {
									opacity: 0,
									width: 0,
								}}
						transition={{
							duration: reduceMotion ? 0 : 0.24,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						/ˈeɪtoʊ/
					</motion.span>
				)}
			</AnimatePresence>
			<Button
				aria-label="Play name pronunciation"
				onClick={handlePlay}
				size="icon-xs"
				type="button"
				variant="ghost"
			>
				<NameVolumeIcon
					audioPlaying={playing}
					className="size-3.5"
					endSync={endSync}
					onEndSyncComplete={onEndSyncComplete}
					aria-hidden
				/>
			</Button>
			<audio preload="none" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
