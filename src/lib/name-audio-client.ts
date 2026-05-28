const CYCLE = 1.45
const MID_T = [0, 0.1, 0.28, 0.48, 0.6, 1]
const MID_V = [0, 1, 1, 1, 0, 0]
const OUT_T = [0, 0.12, 0.18, 0.28, 0.48, 0.6, 1]
const OUT_V = [0, 0, 0, 1, 1, 0, 0]
const BOTH_UP = 0.88

function sample(times: number[], values: number[], u: number): number {
	if (u <= times[0])
		return values[0]
	const last = times.length - 1
	if (u >= times[last])
		return values[last]
	let i = 1
	while (i <= last && u > times[i]) i++
	const t0 = times[i - 1]
	const t1 = times[i]
	const v0 = values[i - 1]
	const v1 = values[i]
	const w = (u - t0) / (t1 - t0)
	return v0 + (v1 - v0) * w
}

function waveOpacities(elapsedSec: number) {
	const mod = ((elapsedSec % CYCLE) + CYCLE) % CYCLE
	const u = mod / CYCLE
	return { mid: sample(MID_T, MID_V, u), outer: sample(OUT_T, OUT_V, u) }
}

function bothUp(mid: number, outer: number) {
	return mid >= BOTH_UP && outer >= BOTH_UP
}

let dispose: (() => void) | null = null

export function initNameAudioButtons() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac

	for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-name-play]')) {
		const root = btn.closest('span') as HTMLElement | null
		if (!root)
			continue

		const audio = root.querySelector<HTMLAudioElement>('[data-name-audio]')
		const ipa = root.querySelector<HTMLElement>('[data-name-ipa]')
		const svg = btn.querySelector<SVGSVGElement>('[data-name-volume-icon]')
		const midPath = svg?.querySelector<SVGPathElement>('[data-wave="mid"]')
		const outerPath = svg?.querySelector<SVGPathElement>('[data-wave="outer"]')
		if (!audio || !ipa || !svg || !midPath || !outerPath)
			continue

		let originMs: null | number = null
		let raf = 0
		let endSync = false

		const loop = () => {
			if (originMs === null) {
				raf = requestAnimationFrame(loop)
				return
			}
			const elapsed = (performance.now() - originMs) / 1000
			const { mid, outer } = waveOpacities(elapsed)
			midPath.style.opacity = String(mid)
			outerPath.style.opacity = String(outer)
			if (endSync && bothUp(mid, outer)) {
				cancelAnimationFrame(raf)
				return
			}
			raf = requestAnimationFrame(loop)
		}

		const startLoop = () => {
			if (originMs === null)
				originMs = performance.now()
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(loop)
		}

		audio.addEventListener('play', () => {
			endSync = false
			startLoop()
		}, { signal })
		audio.addEventListener('pause', () => {
			if (!audio.ended) {
				endSync = false
				cancelAnimationFrame(raf)
				midPath.style.opacity = ''
				outerPath.style.opacity = ''
			}
		}, { signal })
		audio.addEventListener('ended', () => {
			endSync = true
			startLoop()
		}, { signal })

		btn.addEventListener('click', () => {
			ipa.classList.remove('hidden')
			ipa.classList.add('inline-flex')
			audio.currentTime = 0
			void audio.play()
		}, { signal })
	}

	dispose = () => {
		ac.abort()
	}
}
