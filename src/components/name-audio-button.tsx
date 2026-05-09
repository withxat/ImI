'use client'

import { Volume2Icon } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'

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
			<Button
				aria-label="Play name pronunciation"
				className="ml-2 -translate-y-px"
				onClick={handlePlay}
				size="icon-xs"
				type="button"
				variant="ghost"
			>
				<Volume2Icon aria-hidden="true" />
			</Button>
			<audio preload="auto" ref={audioRef} src="/xat.mp3" hidden />
		</span>
	)
}
