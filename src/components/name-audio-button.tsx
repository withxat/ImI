'use client'

import { useRef } from 'react'

export function NameAudioButton() {
	const audioRef = useRef<HTMLAudioElement>(null)

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
			<button
				aria-label="Play name pronunciation"
				className="text-link ml-2 inline-flex -translate-y-px items-center text-sm leading-none text-muted-foreground"
				onClick={handlePlay}
				type="button"
			>
				🔊
			</button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
