import type { AnimationPlaybackControls } from 'motion'

import { animate } from 'motion'

/** Lens-style loupe (mask + scale share one focal point), adapted from shadcn Lens isStatic mode. */
const ANCHOR_INSET_PX = 18
const LEG_DURATION_S = 2.6
const LEG_EASE: [number, number, number, number] = [0.45, 0, 0.2, 1]
const LENS_RADIUS_PX = 42
const ZOOM_FACTOR = 1.8

interface Point {
	x: number
	y: number
}

interface LoupeSetup {
	overlay: HTMLElement
	ring: HTMLElement
	root: HTMLElement
	specimen: HTMLElement
	stage: HTMLElement
	zoom: HTMLElement
}

const activeCleanups: (() => void)[] = []

function textAnchorCenters(root: HTMLElement, specimen: HTMLElement): Point[] {
	const rootRect = root.getBoundingClientRect()
	const specRect = specimen.getBoundingClientRect()
	const ox = specRect.left - rootRect.left
	const oy = specRect.top - rootRect.top
	const tw = specRect.width
	const th = specRect.height
	const inset = ANCHOR_INSET_PX

	return [
		{ x: ox + inset, y: oy + th - inset },
		{ x: ox + tw / 2, y: oy + inset },
		{ x: ox + tw - inset, y: oy + th - inset },
	]
}

function anchorsAreValid(anchors: Point[]) {
	if (anchors.length < 3)
		return false

	const [first] = anchors
	return anchors.some(anchor => anchor.x !== first.x || anchor.y !== first.y)
}

function applyFocalPoint(
	{ overlay, ring, zoom }: Pick<LoupeSetup, 'overlay' | 'ring' | 'zoom'>,
	{ x, y }: Point,
) {
	const mask = `radial-gradient(circle ${LENS_RADIUS_PX}px at ${x}px ${y}px, black 100%, transparent 100%)`
	overlay.style.maskImage = mask
	zoom.style.transform = `scale(${ZOOM_FACTOR})`
	zoom.style.transformOrigin = `${x}px ${y}px`
	ring.style.width = `${LENS_RADIUS_PX * 2}px`
	ring.style.height = `${LENS_RADIUS_PX * 2}px`
	ring.style.left = `${x - LENS_RADIUS_PX}px`
	ring.style.top = `${y - LENS_RADIUS_PX}px`
}

function syncZoomContent(root: HTMLElement, specimen: HTMLElement, zoom: HTMLElement) {
	const clone = zoom.firstElementChild
	if (!(clone instanceof HTMLElement))
		return

	const rootRect = root.getBoundingClientRect()
	const specRect = specimen.getBoundingClientRect()

	clone.style.left = `${specRect.left - rootRect.left}px`
	clone.style.top = `${specRect.top - rootRect.top}px`
	clone.style.width = `${specRect.width}px`
}

function createLoupe(stage: HTMLElement): LoupeSetup | null {
	const root = stage.querySelector<HTMLElement>('[data-wanderer-loupe-root]')
	if (!root)
		return null

	const specimen = root.querySelector<HTMLElement>('[data-wanderer-specimen]')
	const overlay = root.querySelector<HTMLElement>('[data-wanderer-loupe-overlay]')
	const zoom = root.querySelector<HTMLElement>('[data-wanderer-loupe-zoom]')
	const ring = root.querySelector<HTMLElement>('[data-wanderer-loupe-ring]')
	if (!specimen || !overlay || !zoom || !ring)
		return null

	const clone = specimen.cloneNode(true) as HTMLElement
	clone.removeAttribute('data-wanderer-specimen')
	clone.setAttribute('aria-hidden', 'true')
	clone.classList.add('pointer-events-none')
	clone.style.margin = '0'
	clone.style.position = 'absolute'
	zoom.replaceChildren(clone)

	return { overlay, ring, root, specimen, stage, zoom }
}

function waitForLayout(specimen: HTMLElement, onReady: () => void) {
	let attempts = 0
	const maxAttempts = 60

	const check = () => {
		if (specimen.offsetWidth > 0) {
			onReady()
			return
		}

		attempts += 1
		if (attempts >= maxAttempts)
			return

		requestAnimationFrame(check)
	}

	check()
}

function startTour(loupe: LoupeSetup): () => void {
	let disposed = false
	let playback: AnimationPlaybackControls | null = null
	let resizeObserver: null | ResizeObserver = null

	const runKeyframes = () => {
		if (disposed)
			return

		const anchors = textAnchorCenters(loupe.root, loupe.specimen)
		if (!anchorsAreValid(anchors))
			return

		syncZoomContent(loupe.root, loupe.specimen, loupe.zoom)
		playback?.stop()
		playback = null

		const loop = [...anchors, anchors[0]]
		const focal = { x: loop[0].x, y: loop[0].y }
		applyFocalPoint(loupe, focal)

		playback = animate(
			focal,
			{
				x: loop.map(point => point.x),
				y: loop.map(point => point.y),
			},
			{
				duration: LEG_DURATION_S * anchors.length,
				ease: LEG_EASE,
				onUpdate: () => applyFocalPoint(loupe, focal),
				repeat: Infinity,
			},
		)
	}

	waitForLayout(loupe.specimen, runKeyframes)

	resizeObserver = new ResizeObserver(() => {
		runKeyframes()
	})
	resizeObserver.observe(loupe.stage)
	resizeObserver.observe(loupe.specimen)

	return () => {
		disposed = true
		playback?.stop()
		playback = null
		resizeObserver?.disconnect()
		resizeObserver = null
	}
}

export function initDesignWandererPreview() {
	disposeDesignWandererPreview()

	if (!document.querySelector('[data-wanderer-preview]'))
		return

	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

	document.querySelectorAll<HTMLElement>('[data-wanderer-preview]').forEach((stage) => {
		const loupe = createLoupe(stage)
		if (!loupe)
			return

		if (reducedMotion) {
			waitForLayout(loupe.specimen, () => {
				const [anchor] = textAnchorCenters(loupe.root, loupe.specimen)
				syncZoomContent(loupe.root, loupe.specimen, loupe.zoom)
				applyFocalPoint(loupe, anchor)
			})
			return
		}

		activeCleanups.push(startTour(loupe))
	})
}

export function disposeDesignWandererPreview() {
	for (const cleanup of activeCleanups)
		cleanup()
	activeCleanups.length = 0
}
