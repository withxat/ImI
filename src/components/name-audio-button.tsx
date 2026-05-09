'use client'

import { useRef } from 'react'

interface PlayableAudio {
	currentTime: number
	play: () => Promise<void>
}

export function NameAudioButton() {
	const audioRef = useRef<PlayableAudio>(null)

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
				className="
					ml-2 inline-flex -translate-y-px items-center text-sm leading-none text-muted-foreground underline decoration-border underline-offset-4
					transition-colors duration-150
					hover:text-foreground hover:decoration-current
				"
				aria-label="Play name pronunciation"
				onClick={handlePlay}
				type="button"
			>
				🔊
			</button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
