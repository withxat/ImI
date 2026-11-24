/**
 * The home avatar answers pokes (`src/components/home/avatar-poke.astro`). Each poke
 * squishes it (`data-poke`) and shows the next line in its bubble (`.bubble[data-shown]`).
 * Poked again after the last line, it turns away (`data-sulking`) and ignores pokes
 * until it turns back. A pause longer than STREAK_MS starts the lines over.
 */
const STREAK_MS = 3000
const TALK_MS = 2200
const SULK_MS = 3200

let dispose: (() => void) | null = null

export function initAvatarPokes() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac
	const cleanups: Array<() => void> = []

	for (const root of document.querySelectorAll<HTMLElement>('[data-avatar-poke]')) {
		const button = root.querySelector<HTMLButtonElement>('[data-avatar-poke-button]')
		const bubble = root.querySelector<HTMLElement>('[data-avatar-poke-bubble]')
		const lines = JSON.parse(root.dataset.lines ?? '[]') as string[]
		const sulkLine = root.dataset.sulkLine
		if (!button || !bubble || lines.length === 0 || !sulkLine)
			continue

		let count = 0
		let lastPoke = Number.NEGATIVE_INFINITY
		let quiet: ReturnType<typeof setTimeout> | undefined

		const say = (line: string, ms: number, then?: () => void) => {
			bubble.textContent = line
			bubble.dataset.shown = ''
			clearTimeout(quiet)
			quiet = setTimeout(() => {
				delete bubble.dataset.shown
				then?.()
			}, ms)
		}
		cleanups.push(() => clearTimeout(quiet))

		button.addEventListener('click', () => {
			if (root.dataset.sulking !== undefined)
				return
			const now = performance.now()
			if (now - lastPoke > STREAK_MS)
				count = 0
			lastPoke = now

			if (count < lines.length) {
				// Restart the squish even when the last one is still running.
				delete root.dataset.poke
				void root.offsetWidth
				root.dataset.poke = ''
				say(lines[count]!, TALK_MS)
				count++
				return
			}
			root.dataset.sulking = ''
			say(sulkLine, SULK_MS, () => {
				delete root.dataset.sulking
				count = 0
			})
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
