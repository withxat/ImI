interface ScrollbarPalette {
	dot: string
	dotActive: string
	dotHalo: string
	shadow: string
	thumb: string
	thumbActive: string
	track: string
}

interface SectionMarker {
	currentY: number
	element: HTMLElement
	targetY: number
	title: string
}

const HOTZONE_WIDTH = 24
const TRACK_WIDTH = 7
const TRACK_CENTER_X = HOTZONE_WIDTH - 7
const THUMB_WIDTH = 4
const THUMB_ACTIVE_WIDTH = 6
const DOT_RADIUS = 2.5
const MIN_THUMB_HEIGHT = 44
const HIDE_DELAY = 1600

let cleanup: (() => void) | null = null

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function lerp(current: number, target: number, amount: number) {
	return current + (target - current) * amount
}

function getScrollMetrics() {
	const scrollElement = document.scrollingElement ?? document.documentElement
	const viewportHeight = window.innerHeight
	const scrollHeight = Math.max(scrollElement.scrollHeight, document.documentElement.scrollHeight, document.body.scrollHeight)
	const maxScroll = Math.max(0, scrollHeight - viewportHeight)

	return {
		maxScroll,
		scrollHeight,
		scrollTop: scrollElement.scrollTop,
		viewportHeight,
	}
}

function getCssColor(name: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function getPalette(): ScrollbarPalette {
	const foreground = getCssColor('--foreground')
	const background = getCssColor('--background')
	const highlightSoft = getCssColor('--highlight-soft')
	const highlightText = getCssColor('--highlight-text')
	const muted = getCssColor('--muted-foreground')

	return {
		dot: `color-mix(in oklab, ${muted} 54%, transparent)`,
		dotActive: highlightText,
		dotHalo: `color-mix(in oklab, ${background} 88%, transparent)`,
		shadow: `color-mix(in oklab, ${background} 72%, transparent)`,
		thumb: `color-mix(in oklab, ${highlightText} 72%, ${foreground})`,
		thumbActive: highlightText,
		track: `color-mix(in oklab, ${highlightSoft} 42%, transparent)`,
	}
}

function scrollToTopInstant(top: number) {
	const root = document.documentElement
	const previousScrollBehavior = root.style.scrollBehavior
	root.style.scrollBehavior = 'auto'
	window.scrollTo({ top })
	root.style.scrollBehavior = previousScrollBehavior
}

function scrollToTopSmooth(top: number) {
	window.scrollTo({ behavior: 'smooth', top })
}

function collectSectionMarkers(): SectionMarker[] {
	return Array.from(document.querySelectorAll<HTMLElement>('.article-body h2[id]'))
		.map(element => ({
			currentY: 0,
			element,
			targetY: 0,
			title: element.textContent?.trim() ?? '',
		}))
		.filter(marker => marker.title.length > 0)
}

function createTooltip() {
	const tooltip = document.createElement('div')
	tooltip.className = 'custom-scrollbar-tooltip'
	tooltip.hidden = true
	document.body.append(tooltip)
	return tooltip
}

function supportsCustomScrollbar() {
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
	return !reducedMotion.matches
}

export function destroyCustomScrollbar() {
	cleanup?.()
	cleanup = null
}

export function initCustomScrollbar() {
	destroyCustomScrollbar()

	const root = document.documentElement
	if (!supportsCustomScrollbar()) {
		root.classList.remove('custom-scrollbar-ready')
		root.classList.add('custom-scrollbar-native')
		return
	}

	const canvas = document.createElement('canvas')
	const canvasContext = canvas.getContext('2d')
	if (!canvasContext) {
		root.classList.add('custom-scrollbar-native')
		return
	}
	const context: CanvasRenderingContext2D = canvasContext

	canvas.className = 'custom-scrollbar-canvas'
	canvas.setAttribute('aria-hidden', 'true')
	document.body.append(canvas)

	const tooltip = createTooltip()
	const abortController = new AbortController()
	const { signal } = abortController
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

	let activePointerId: null | number = null
	let animationFrame = 0
	let dragging = false
	let hideTimer = 0
	let hover = false
	let hoveredMarker: null | SectionMarker = null
	let needsMeasure = true
	let palette = getPalette()
	let trackHeight = 0
	let trackTop = 0

	let alpha = 0
	let targetAlpha = 0
	let offsetX = 12
	let targetOffsetX = 12
	let thumbHeight = MIN_THUMB_HEIGHT
	let thumbTop = 0
	let thumbWidth = THUMB_WIDTH

	const markers = collectSectionMarkers()
	const resizeObserver = new ResizeObserver(() => {
		needsMeasure = true
		showTemporarily()
		startAnimation()
	})

	function setNativeFallback() {
		root.classList.remove('custom-scrollbar-ready')
		root.classList.add('custom-scrollbar-native')
	}

	function setCustomReady() {
		root.classList.add('custom-scrollbar-ready')
		root.classList.remove('custom-scrollbar-native')
	}

	function resizeCanvas() {
		const dpr = window.devicePixelRatio || 1
		const width = HOTZONE_WIDTH
		const height = window.innerHeight
		canvas.width = Math.round(width * dpr)
		canvas.height = Math.round(height * dpr)
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`
		context.setTransform(dpr, 0, 0, dpr, 0, 0)
		trackTop = 14
		trackHeight = Math.max(0, height - trackTop * 2)
		needsMeasure = true
	}

	function measure() {
		const { maxScroll, scrollHeight } = getScrollMetrics()
		const maxMarkerY = Math.max(1, scrollHeight - window.innerHeight)

		for (const marker of markers) {
			const absoluteTop = marker.element.getBoundingClientRect().top + window.scrollY
			marker.targetY = trackTop + clamp(absoluteTop / maxMarkerY, 0, 1) * trackHeight
		}

		if (maxScroll <= 0) {
			targetAlpha = 0
		}

		needsMeasure = false
	}

	function showTemporarily() {
		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}
		targetAlpha = 1
		targetOffsetX = 0
		hideTimer = window.setTimeout(() => {
			if (!dragging && !hover) {
				targetAlpha = 0
				targetOffsetX = 12
				startAnimation()
			}
		}, HIDE_DELAY)
	}

	function updateTooltip(marker: null | SectionMarker, y = 0) {
		hoveredMarker = marker
		if (!marker) {
			tooltip.hidden = true
			return
		}

		tooltip.textContent = marker.title
		tooltip.hidden = false
		const rect = tooltip.getBoundingClientRect()
		const top = clamp(y - rect.height / 2, 12, window.innerHeight - rect.height - 12)
		tooltip.style.top = `${top}px`
		tooltip.style.right = `${HOTZONE_WIDTH + 8}px`
	}

	function findMarkerAt(clientY: number) {
		return markers.find(marker => Math.abs(marker.currentY - clientY) <= 9) ?? null
	}

	function scrollToClientY(clientY: number) {
		const { maxScroll } = getScrollMetrics()
		if (maxScroll <= 0) {
			return
		}

		const ratio = clamp((clientY - trackTop - thumbHeight / 2) / Math.max(1, trackHeight - thumbHeight), 0, 1)
		scrollToTopInstant(ratio * maxScroll)
	}

	function drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
		const safeRadius = Math.min(radius, width / 2, height / 2)
		context.beginPath()
		context.roundRect(x, y, width, height, safeRadius)
		context.fill()
	}

	function draw() {
		animationFrame = 0

		if (reducedMotion.matches) {
			destroyCustomScrollbar()
			setNativeFallback()
			return
		}

		if (needsMeasure) {
			measure()
		}

		const { maxScroll, scrollHeight, scrollTop, viewportHeight } = getScrollMetrics()
		const hasScroll = maxScroll > 1
		const targetThumbHeight = hasScroll ? clamp((viewportHeight / scrollHeight) * trackHeight, MIN_THUMB_HEIGHT, trackHeight) : trackHeight
		const targetThumbTop = hasScroll ? trackTop + (scrollTop / maxScroll) * (trackHeight - targetThumbHeight) : trackTop
		const targetThumbWidth = dragging || hover ? THUMB_ACTIVE_WIDTH : THUMB_WIDTH
		const ease = dragging ? 1 : 0.18

		thumbHeight = lerp(thumbHeight, targetThumbHeight, ease)
		thumbTop = lerp(thumbTop, targetThumbTop, ease)
		thumbWidth = lerp(thumbWidth, targetThumbWidth, 0.22)
		alpha = lerp(alpha, hasScroll ? targetAlpha : 0, 0.16)
		offsetX = lerp(offsetX, targetOffsetX, 0.16)

		context.clearRect(0, 0, HOTZONE_WIDTH, window.innerHeight)

		if (alpha > 0.01 && hasScroll) {
			const trackX = TRACK_CENTER_X - TRACK_WIDTH / 2 + offsetX
			const thumbX = TRACK_CENTER_X - thumbWidth / 2 + offsetX

			context.save()
			context.globalAlpha = alpha

			context.fillStyle = palette.shadow
			drawRoundedRect(TRACK_CENTER_X + TRACK_WIDTH / 2 - 1 + offsetX, 0, HOTZONE_WIDTH - TRACK_CENTER_X, window.innerHeight, 0)

			context.fillStyle = palette.track
			drawRoundedRect(trackX, trackTop, TRACK_WIDTH, trackHeight, TRACK_WIDTH / 2)

			context.fillStyle = dragging || hover ? palette.thumbActive : palette.thumb
			drawRoundedRect(thumbX, thumbTop, thumbWidth, thumbHeight, thumbWidth / 2)

			for (const marker of markers) {
				marker.currentY = lerp(marker.currentY || marker.targetY, marker.targetY, 0.2)
				const isInsideThumb = marker.currentY >= thumbTop - 4 && marker.currentY <= thumbTop + thumbHeight + 4
				context.fillStyle = palette.dotHalo
				context.beginPath()
				context.arc(TRACK_CENTER_X + offsetX, marker.currentY, DOT_RADIUS + 2, 0, Math.PI * 2)
				context.fill()
				context.fillStyle = isInsideThumb || marker === hoveredMarker ? palette.dotActive : palette.dot
				context.beginPath()
				context.arc(TRACK_CENTER_X + offsetX, marker.currentY, marker === hoveredMarker ? DOT_RADIUS + 1 : DOT_RADIUS, 0, Math.PI * 2)
				context.fill()
			}

			context.restore()
		}

		const needsMoreFrames
			= Math.abs(alpha - targetAlpha) > 0.01
				|| Math.abs(offsetX - targetOffsetX) > 0.1
				|| Math.abs(thumbTop - targetThumbTop) > 0.1
				|| Math.abs(thumbHeight - targetThumbHeight) > 0.1
				|| markers.some(marker => Math.abs(marker.currentY - marker.targetY) > 0.1)

		if (needsMoreFrames) {
			startAnimation()
		}
	}

	function startAnimation() {
		if (!animationFrame) {
			animationFrame = window.requestAnimationFrame(draw)
		}
	}

	function handlePointerMove(event: PointerEvent) {
		showTemporarily()
		hover = true
		document.body.classList.toggle('custom-scrollbar-dragging', dragging)
		targetOffsetX = 0

		if (dragging) {
			event.preventDefault()
			scrollToClientY(event.clientY)
		}
		else {
			updateTooltip(findMarkerAt(event.clientY), event.clientY)
		}

		startAnimation()
	}

	function handlePointerLeave() {
		hover = false
		updateTooltip(null)
		document.body.classList.remove('custom-scrollbar-dragging')
		showTemporarily()
	}

	function handlePointerDown(event: PointerEvent) {
		if (event.button !== 0) {
			return
		}

		const marker = findMarkerAt(event.clientY)
		event.preventDefault()
		canvas.setPointerCapture(event.pointerId)
		activePointerId = event.pointerId
		dragging = true
		updateTooltip(null)
		document.body.classList.add('custom-scrollbar-dragging')

		if (marker) {
			scrollToTopSmooth(marker.element.getBoundingClientRect().top + window.scrollY)
		}
		else {
			scrollToClientY(event.clientY)
		}

		showTemporarily()
		startAnimation()
	}

	function handlePointerUp(event: PointerEvent) {
		if (activePointerId !== event.pointerId) {
			return
		}

		activePointerId = null
		dragging = false
		document.body.classList.remove('custom-scrollbar-dragging')
		if (canvas.hasPointerCapture(event.pointerId)) {
			canvas.releasePointerCapture(event.pointerId)
		}
		showTemporarily()
		startAnimation()
	}

	function handleThemeChange() {
		palette = getPalette()
		startAnimation()
	}

	function handleResize() {
		if (!supportsCustomScrollbar()) {
			destroyCustomScrollbar()
			setNativeFallback()
			return
		}

		resizeCanvas()
		showTemporarily()
		startAnimation()
	}

	resizeCanvas()
	resizeObserver.observe(document.body)
	resizeObserver.observe(document.documentElement)
	setCustomReady()
	showTemporarily()
	startAnimation()

	window.addEventListener('scroll', () => {
		showTemporarily()
		startAnimation()
	}, { passive: true, signal })
	window.addEventListener('resize', handleResize, { passive: true, signal })
	reducedMotion.addEventListener('change', handleResize, { signal })
	canvas.addEventListener('pointermove', handlePointerMove, { signal })
	canvas.addEventListener('pointerleave', handlePointerLeave, { signal })
	canvas.addEventListener('pointerdown', handlePointerDown, { signal })
	canvas.addEventListener('pointerup', handlePointerUp, { signal })
	canvas.addEventListener('pointercancel', handlePointerUp, { signal })
	document.addEventListener('astro:after-swap', handleThemeChange, { signal })

	cleanup = () => {
		abortController.abort()
		resizeObserver.disconnect()
		if (animationFrame) {
			window.cancelAnimationFrame(animationFrame)
		}
		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}
		canvas.remove()
		tooltip.remove()
		document.body.classList.remove('custom-scrollbar-dragging')
	}
}
