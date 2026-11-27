/**
 * The home avatar answers pokes (`src/components/home/avatar-poke.astro`). Each poke
 * squishes it (`data-poke`) and shows the next line in its bubble (`.bubble[data-shown]`).
 * Poked again after the last line, it hops (`data-secret`) and opens a retro RPG dialog
 * that types out an invitation to `/resume`. A pause longer than STREAK_MS starts the lines over.
 */
const STREAK_MS = 3000
const TALK_MS = 2200
const TYPE_START_DELAY_MS = 180
const TYPE_STEP_MS = 40
const BLIP_MIN_GAP_MS = 60

/** Bright 8-bit RPG "secret unlocked" arpeggio (D5 -> F#5 -> A5 -> D6), in Hz and seconds. */
const SECRET_CHIME: ReadonlyArray<readonly [freq: number, offset: number, duration: number]> = [
	[587.33, 0, 0.056],
	[739.99, 0.052, 0.056],
	[880, 0.104, 0.056],
	[1174.66, 0.156, 0.16],
]

/** Gentle stepped pitches for the 8-bit RPG dialogue typewriter voice. */
const BLIP_FREQS = [500, 540, 520, 570] as const
const SILENT_CHAR_RE = /[\s!?,.:;！？，。、：；]/

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
	try {
		const AudioCtor = window.AudioContext
		if (!AudioCtor)
			return null
		audioCtx ??= new AudioCtor()
		if (audioCtx.state === 'suspended')
			void audioCtx.resume()
		return audioCtx
	}
	catch {
		return null
	}
}

function playSecretSound() {
	const ctx = getAudioContext()
	if (!ctx)
		return
	try {
		const now = ctx.currentTime
		// Warm the square wave slightly like a handheld speaker so high harmonics stay gentle.
		const filter = ctx.createBiquadFilter()
		filter.type = 'lowpass'
		filter.frequency.setValueAtTime(3600, now)
		filter.connect(ctx.destination)

		for (const [freq, offset, duration] of SECRET_CHIME) {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			const start = now + offset
			const end = start + duration

			osc.type = 'square'
			osc.frequency.setValueAtTime(freq, start)

			gain.gain.setValueAtTime(0.0001, start)
			gain.gain.linearRampToValueAtTime(0.07, start + 0.005)
			gain.gain.exponentialRampToValueAtTime(0.0001, end)

			osc.connect(gain)
			gain.connect(filter)
			osc.start(start)
			osc.stop(end + 0.01)
		}
	}
	catch {
		// Ignore environments with blocked playback.
	}
}

function playTypeBlip(step: number) {
	const ctx = getAudioContext()
	if (!ctx || ctx.state !== 'running')
		return
	try {
		const now = ctx.currentTime
		const osc = ctx.createOscillator()
		const filter = ctx.createBiquadFilter()
		const gain = ctx.createGain()

		osc.type = 'square'
		osc.frequency.setValueAtTime(BLIP_FREQS[step % BLIP_FREQS.length]!, now)

		filter.type = 'lowpass'
		filter.frequency.setValueAtTime(2400, now)

		gain.gain.setValueAtTime(0.0001, now)
		gain.gain.linearRampToValueAtTime(0.036, now + 0.003)
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026)

		osc.connect(filter)
		filter.connect(gain)
		gain.connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.032)
	}
	catch {
		// Ignore environments with blocked playback.
	}
}

let dispose: (() => void) | null = null

export function initAvatarPokes() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const cleanups: Array<() => void> = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-avatar-poke]')) {
		const button = root.querySelector<HTMLButtonElement>('[data-avatar-poke-button]')
		const bubble = root.querySelector<HTMLElement>('[data-avatar-poke-bubble]')
		const secret = root.querySelector<HTMLElement>('[data-avatar-poke-secret]')
		const secretText = root.querySelector<HTMLElement>('[data-avatar-poke-secret-text]')
		const closeButton = root.querySelector<HTMLButtonElement>('[data-avatar-poke-close]')
		const lines = JSON.parse(root.dataset.lines ?? '[]') as string[]
		const secretLine = root.dataset.secretLine
		if (!button || !bubble || !secret || !secretText || lines.length === 0 || !secretLine)
			continue

		let count = 0
		let lastPoke = Number.NEGATIVE_INFINITY
		let quiet: ReturnType<typeof setTimeout> | undefined
		let typeDelay: ReturnType<typeof setTimeout> | undefined
		let typer: ReturnType<typeof setInterval> | undefined

		const stopTyping = () => {
			clearTimeout(typeDelay)
			typeDelay = undefined
			clearInterval(typer)
			typer = undefined
			delete secretText.dataset.typing
		}

		const closeSecret = (returnFocus = false) => {
			if (root.dataset.secret === undefined)
				return
			stopTyping()
			delete root.dataset.secret
			delete secret.dataset.shown
			secret.hidden = true
			secretText.textContent = ''
			count = 0
			if (returnFocus)
				button.focus()
		}

		const openSecret = () => {
			clearTimeout(quiet)
			delete bubble.dataset.shown
			delete root.dataset.poke
			root.dataset.secret = ''
			secret.hidden = false
			void secret.offsetWidth
			secret.dataset.shown = ''
			playSecretSound()

			stopTyping()
			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			if (reducedMotion) {
				secretText.textContent = secretLine
				return
			}

			const chars = Array.from(secretLine)
			let index = 0
			let blipStep = 0
			let lastBlip = Number.NEGATIVE_INFINITY
			secretText.textContent = ''
			secretText.dataset.typing = ''
			typeDelay = setTimeout(() => {
				typer = setInterval(() => {
					const ch = chars[index] ?? ''
					index++
					secretText.textContent = chars.slice(0, index).join('')
					const now = performance.now()
					if (!SILENT_CHAR_RE.test(ch) && now - lastBlip >= BLIP_MIN_GAP_MS) {
						playTypeBlip(blipStep++)
						lastBlip = now
					}
					if (index >= chars.length)
						stopTyping()
				}, TYPE_STEP_MS)
			}, TYPE_START_DELAY_MS)
		}

		const say = (line: string, ms: number) => {
			bubble.textContent = line
			bubble.dataset.shown = ''
			clearTimeout(quiet)
			quiet = setTimeout(() => {
				delete bubble.dataset.shown
			}, ms)
		}

		cleanups.push(() => {
			clearTimeout(quiet)
			stopTyping()
		})

		const prewarmFont = () => {
			void document.fonts?.load('12px "Fusion Pixel 12px"')
		}

		button.addEventListener('pointerenter', prewarmFont, { once: true, signal })
		button.addEventListener('focus', prewarmFont, { once: true, signal })

		button.addEventListener('click', () => {
			if (root.dataset.secret !== undefined) {
				closeSecret()
				return
			}

			const now = performance.now()
			if (now - lastPoke > STREAK_MS)
				count = 0
			lastPoke = now

			if (count < lines.length) {
				if (count === 0)
					prewarmFont()
				// Restart the squish even when the last one is still running.
				delete root.dataset.poke
				void root.offsetWidth
				root.dataset.poke = ''
				say(lines[count]!, TALK_MS)
				count++
				return
			}

			openSecret()
		}, { signal })

		closeButton?.addEventListener('click', () => closeSecret(true), { signal })

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && root.dataset.secret !== undefined)
				closeSecret(true)
		}, { signal })

		document.addEventListener('pointerdown', (event) => {
			if (root.dataset.secret === undefined)
				return
			if (event.target instanceof Node && !root.contains(event.target))
				closeSecret()
		}, { signal })

		root.addEventListener('animationend', (event) => {
			if (event.animationName === 'avatar-poke-squish')
				delete root.dataset.poke
		}, { signal })
	}

	dispose = () => {
		ac.abort()
		for (const cleanup of cleanups)
			cleanup()
	}
}
