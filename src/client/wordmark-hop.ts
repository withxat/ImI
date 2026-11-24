/**
 * The "Xat" wordmark's letters hop in turn while `data-hop` is set (`.wordmark-hop`
 * in globals.css). A mouse arriving starts a hop; the attribute stays until the
 * last letter lands, so leaving mid-hop never snaps the letters back.
 */
export function hopWordmark(wordmark: HTMLElement, restart = false) {
	if (!restart && wordmark.dataset.hop !== undefined)
		return
	delete wordmark.dataset.hop
	void wordmark.offsetWidth
	wordmark.dataset.hop = ''
}

let dispose: (() => void) | null = null

export function initWordmarkHops() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac

	for (const wordmark of document.querySelectorAll<HTMLElement>('[data-wordmark]')) {
		wordmark.addEventListener('pointerenter', (event) => {
			if (event.pointerType === 'mouse')
				hopWordmark(wordmark)
		}, { signal })
		wordmark.addEventListener('animationend', (event) => {
			if (event.target === wordmark.lastElementChild)
				delete wordmark.dataset.hop
		}, { signal })
	}

	dispose = () => {
		ac.abort()
	}
}
