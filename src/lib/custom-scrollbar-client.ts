import { animate } from 'motion'

type AnimationControls = ReturnType<typeof animate>

interface SectionMarker {
	button: HTMLButtonElement
	element: HTMLElement
	title: string
	y: number
}

const HOTZONE_WIDTH = 24
const MIN_TRACK_WIDTH = 768
const TRACK_TOP = 14
const THUMB_TOUCH_HIT_SLOP = 18
const MIN_THUMB_HEIGHT = 44
const HIDE_DELAY = 1600
const MARKER_HIT_RADIUS = 9

let cleanup: (() => void) | null = null

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function getScrollMetrics() {
	const scrollElement = document.scrollingElement ?? document.documentElement
	const viewportHeight = window.innerHeight
	const scrollHeight = Math.max(
		scrollElement.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.scrollHeight,
	)
	const maxScroll = Math.max(0, scrollHeight - viewportHeight)

	return {
		maxScroll,
		scrollHeight,
		scrollTop: scrollElement.scrollTop,
		viewportHeight,
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

function collectSectionMarkers(markersHost: HTMLElement): SectionMarker[] {
	return Array.from(document.querySelectorAll<HTMLElement>('.article-body h2[id]'))
		.map((element) => {
			const title = element.textContent?.trim() ?? ''
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'custom-scrollbar-marker'
			button.setAttribute('aria-label', title)
			button.dataset.title = title
			markersHost.append(button)
			return { button, element, title, y: 0 }
		})
		.filter(marker => marker.title.length > 0)
}

function supportsCustomScrollbar() {
	return !matchMedia('(prefers-reduced-motion: reduce)').matches
}

function supportsTrackHover(canHover: MediaQueryList) {
	return canHover.matches && window.innerWidth >= MIN_TRACK_WIDTH
}

function supportsScrollTimeline() {
	return CSS.supports('animation-timeline: scroll(root block)')
		|| CSS.supports('animation-timeline: scroll()')
}

function createTooltip() {
	const tooltip = document.createElement('div')
	tooltip.className = 'custom-scrollbar-tooltip'
	tooltip.hidden = true
	document.body.append(tooltip)
	return tooltip
}

function createScrollbarShell() {
	const shell = document.createElement('div')
	shell.className = 'custom-scrollbar'
	shell.setAttribute('aria-hidden', 'true')
	shell.style.setProperty('--cs-hotzone-width', `${HOTZONE_WIDTH}px`)

	const trackShadow = document.createElement('div')
	trackShadow.className = 'custom-scrollbar-track-shadow'

	const track = document.createElement('div')
	track.className = 'custom-scrollbar-track'

	const thumb = document.createElement('div')
	thumb.className = 'custom-scrollbar-thumb'

	const markersHost = document.createElement('div')
	markersHost.className = 'custom-scrollbar-markers'

	shell.append(trackShadow, track, thumb, markersHost)
	document.body.append(shell)

	return { markersHost, shell, thumb, track, trackShadow }
}

export function destroyCustomScrollbar() {
	cleanup?.()
	cleanup = null
}

export function initCustomScrollbar() {
	destroyCustomScrollbar()

	const root = document.documentElement
	if (!supportsCustomScrollbar()) {
		root.classList.remove('custom-scrollbar-ready', 'custom-scrollbar-scroll-driven', 'custom-scrollbar-js-driven')
		root.classList.add('custom-scrollbar-native')
		return
	}

	const { markersHost, shell, thumb } = createScrollbarShell()
	const tooltip = createTooltip()
	const abortController = new AbortController()
	const { signal } = abortController
	const canHover = matchMedia('(hover: hover) and (pointer: fine)')
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
	const scrollDriven = supportsScrollTimeline()

	let activePointerId: null | number = null
	let touchDragCleanup: (() => void) | null = null
	let dragging = false
	let hideTimer = 0
	let hover = false
	let trackHeight = 0
	let thumbHeight = MIN_THUMB_HEIGHT
	let thumbTop = TRACK_TOP
	let thumbPointerOffset = MIN_THUMB_HEIGHT / 2
	let thumbTravel = 0
	let firstMeasure = true
	let trackHeightVisual = 0
	let thumbHeightVisual = MIN_THUMB_HEIGHT
	let thumbTravelVisual = 0
	let trackHeightAnim: AnimationControls | null = null
	let thumbHeightAnim: AnimationControls | null = null
	let thumbTravelAnim: AnimationControls | null = null

	function springTo(
		current: number,
		target: number,
		onUpdate: (value: number) => void,
	): AnimationControls | null {
		if (firstMeasure || Math.abs(target - current) < 1) {
			onUpdate(target)
			return null
		}
		return animate(current, target, {
			bounce: 0.18,
			duration: 0.45,
			onUpdate,
			type: 'spring',
		})
	}

	const markers = collectSectionMarkers(markersHost)
	const resizeObserver = new ResizeObserver(() => {
		measure()
		showTemporarily()
	})

	function setNativeFallback() {
		root.classList.remove('custom-scrollbar-ready', 'custom-scrollbar-scroll-driven', 'custom-scrollbar-js-driven')
		root.classList.add('custom-scrollbar-native')
	}

	function setCustomReady() {
		root.classList.add('custom-scrollbar-ready')
		root.classList.remove('custom-scrollbar-native')
		if (scrollDriven) {
			root.classList.add('custom-scrollbar-scroll-driven')
			root.classList.remove('custom-scrollbar-js-driven')
		}
		else {
			root.classList.add('custom-scrollbar-js-driven')
			root.classList.remove('custom-scrollbar-scroll-driven')
		}
	}

	function setVisible(visible: boolean) {
		shell.classList.toggle('is-visible', visible)
	}

	function setInteracting(interacting: boolean) {
		shell.classList.toggle('is-active', interacting)
		shell.classList.toggle('is-dragging', dragging)
	}

	function measure() {
		const viewportHeight = window.innerHeight
		trackHeight = Math.max(0, viewportHeight - TRACK_TOP * 2)

		const { maxScroll, scrollHeight, viewportHeight: vh } = getScrollMetrics()
		const hasScroll = maxScroll > 1

		thumbHeight = hasScroll
			? clamp((vh / scrollHeight) * trackHeight, MIN_THUMB_HEIGHT, trackHeight)
			: trackHeight
		thumbTravel = Math.max(0, trackHeight - thumbHeight)

		root.style.setProperty('--cs-track-top', `${TRACK_TOP}px`)

		trackHeightAnim?.stop()
		thumbHeightAnim?.stop()
		thumbTravelAnim?.stop()

		trackHeightAnim = springTo(trackHeightVisual, trackHeight, (value) => {
			trackHeightVisual = value
			root.style.setProperty('--cs-track-height', `${value}px`)
		})
		thumbHeightAnim = springTo(thumbHeightVisual, thumbHeight, (value) => {
			thumbHeightVisual = value
			root.style.setProperty('--cs-thumb-height', `${value}px`)
		})
		thumbTravelAnim = springTo(thumbTravelVisual, thumbTravel, (value) => {
			thumbTravelVisual = value
			root.style.setProperty('--cs-thumb-travel', `${value}px`)
		})

		firstMeasure = false

		shell.classList.toggle('has-scroll', hasScroll)

		const maxMarkerY = Math.max(1, scrollHeight - viewportHeight)
		for (const marker of markers) {
			const absoluteTop = marker.element.getBoundingClientRect().top + window.scrollY
			marker.y = TRACK_TOP + clamp(absoluteTop / maxMarkerY, 0, 1) * trackHeight
			marker.button.style.top = `${marker.y}px`
		}

		if (!hasScroll) {
			setVisible(false)
		}

		syncThumbFromScroll()
		updateMarkerStates()
	}

	function syncThumbFromScroll() {
		const { maxScroll, scrollTop } = getScrollMetrics()
		if (maxScroll <= 1) {
			thumbTop = TRACK_TOP
			return
		}

		thumbTop = TRACK_TOP + (scrollTop / maxScroll) * thumbTravel

		if (scrollDriven) {
			thumb.style.removeProperty('transform')
		}
		else {
			const y = (scrollTop / maxScroll) * thumbTravel
			thumb.style.transform = `translate3d(0, ${y}px, 0)`
		}
	}

	function showTemporarily(options: { active?: boolean } = {}) {
		const { maxScroll } = getScrollMetrics()
		if (maxScroll <= 1) {
			return
		}

		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}

		setVisible(true)
		setInteracting(options.active || hover || dragging)

		hideTimer = window.setTimeout(() => {
			if (!dragging && !hover) {
				setVisible(false)
				setInteracting(false)
			}
		}, HIDE_DELAY)
	}

	function updateTooltip(marker: null | SectionMarker, y = 0) {
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
		return markers.find(marker => Math.abs(marker.y - clientY) <= MARKER_HIT_RADIUS) ?? null
	}

	function scrollTopForClientY(clientY: number, offset = thumbHeight / 2) {
		const { maxScroll } = getScrollMetrics()
		if (maxScroll <= 0) {
			return null
		}

		const ratio = clamp(
			(clientY - TRACK_TOP - offset) / Math.max(1, trackHeight - thumbHeight),
			0,
			1,
		)
		return ratio * maxScroll
	}

	function scrollToClientY(clientY: number) {
		const top = scrollTopForClientY(clientY, thumbPointerOffset)
		if (top !== null) {
			scrollToTopInstant(top)
		}
	}

	function scrollToClientYSmooth(clientY: number) {
		const top = scrollTopForClientY(clientY)
		if (top !== null) {
			scrollToTopSmooth(top)
		}
	}

	function isPointInsideThumb(clientY: number, slop = 0) {
		return clientY >= thumbTop - slop && clientY <= thumbTop + thumbHeight + slop
	}

	function updateThumbPointerOffset(clientY: number) {
		thumbPointerOffset = clamp(clientY - thumbTop, 0, thumbHeight)
	}

	function updateMarkerStates() {
		const { maxScroll } = getScrollMetrics()
		if (maxScroll <= 1) {
			return
		}

		syncThumbFromScroll()
		const thumbBottom = thumbTop + thumbHeight

		for (const marker of markers) {
			const isInside = marker.y >= thumbTop - 4 && marker.y <= thumbBottom + 4
			marker.button.classList.toggle('is-inside-thumb', isInside)
		}
	}

	function handleScroll() {
		showTemporarily({ active: !supportsTrackHover(canHover) })
		if (!scrollDriven) {
			syncThumbFromScroll()
		}
		else {
			const { maxScroll, scrollTop } = getScrollMetrics()
			thumbTop = TRACK_TOP + (maxScroll > 1 ? (scrollTop / maxScroll) * thumbTravel : 0)
		}
		updateMarkerStates()
	}

	function handlePointerMove(event: PointerEvent) {
		showTemporarily()
		hover = true
		setInteracting(true)
		document.body.classList.toggle('custom-scrollbar-dragging', dragging)

		if (dragging) {
			event.preventDefault()
			scrollToClientY(event.clientY)
		}
		else {
			const marker = findMarkerAt(event.clientY)
			for (const item of markers) {
				item.button.classList.toggle('is-hovered', item === marker)
			}
			updateTooltip(marker, event.clientY)
		}
	}

	function handlePointerLeave() {
		hover = false
		for (const item of markers) {
			item.button.classList.remove('is-hovered')
		}
		updateTooltip(null)
		document.body.classList.remove('custom-scrollbar-dragging')
		setInteracting(false)
		showTemporarily()
	}

	function setupTouchDrag() {
		const onTouchMove = (event: TouchEvent) => {
			if (event.touches.length !== 1) {
				return
			}
			event.preventDefault()
			scrollToClientY(event.touches[0].clientY)
			showTemporarily()
		}

		const onTouchEnd = () => {
			endDrag()
		}

		document.addEventListener('touchmove', onTouchMove, { passive: false, signal })
		document.addEventListener('touchend', onTouchEnd, { once: true, signal })
		document.addEventListener('touchcancel', onTouchEnd, { once: true, signal })

		touchDragCleanup = () => {
			document.removeEventListener('touchmove', onTouchMove)
			document.removeEventListener('touchend', onTouchEnd)
			document.removeEventListener('touchcancel', onTouchEnd)
		}
	}

	function endDrag() {
		touchDragCleanup?.()
		touchDragCleanup = null
		activePointerId = null
		dragging = false
		document.body.classList.remove('custom-scrollbar-dragging')
		setInteracting(hover)
		updateMarkerStates()
		showTemporarily()
	}

	function handlePointerDown(event: PointerEvent) {
		if (event.button !== 0) {
			return
		}

		syncThumbFromScroll()
		const allowsTrackClick = supportsTrackHover(canHover)
		const isTouchLike = event.pointerType === 'touch' || !allowsTrackClick
		const isThumbPress = isPointInsideThumb(event.clientY, isTouchLike ? THUMB_TOUCH_HIT_SLOP : 0)
		const marker = isThumbPress ? null : findMarkerAt(event.clientY)
		const isTouch = event.pointerType === 'touch'

		if (marker) {
			event.preventDefault()
			if (!isTouch) {
				shell.setPointerCapture(event.pointerId)
			}
			activePointerId = event.pointerId
			updateTooltip(null)
			dragging = false
			scrollToTopSmooth(marker.element.getBoundingClientRect().top + window.scrollY)
		}
		else if (isThumbPress) {
			event.preventDefault()
			if (!isTouch) {
				shell.setPointerCapture(event.pointerId)
			}
			activePointerId = event.pointerId
			updateTooltip(null)
			dragging = true
			setInteracting(true)
			updateThumbPointerOffset(event.clientY)
			document.body.classList.add('custom-scrollbar-dragging')
			if (isTouch) {
				setupTouchDrag()
			}
		}
		else if (allowsTrackClick) {
			event.preventDefault()
			if (!isTouch) {
				shell.setPointerCapture(event.pointerId)
			}
			activePointerId = event.pointerId
			updateTooltip(null)
			dragging = false
			scrollToClientYSmooth(event.clientY)
		}
		else {
			return
		}

		showTemporarily()
	}

	function preventTouchScroll(event: TouchEvent) {
		if (activePointerId !== null) {
			event.preventDefault()
		}
	}

	function handlePointerUp(event: PointerEvent) {
		if (activePointerId !== event.pointerId) {
			return
		}

		if (shell.hasPointerCapture(event.pointerId)) {
			shell.releasePointerCapture(event.pointerId)
		}
		endDrag()
	}

	function handleResize() {
		if (!supportsCustomScrollbar()) {
			destroyCustomScrollbar()
			setNativeFallback()
			return
		}

		measure()
		showTemporarily()
	}

	function handleAfterSwap() {
		measure()
		showTemporarily()
	}

	for (const marker of markers) {
		marker.button.addEventListener('click', (event) => {
			event.preventDefault()
			scrollToTopSmooth(marker.element.getBoundingClientRect().top + window.scrollY)
			showTemporarily()
		}, { signal })
	}

	measure()
	resizeObserver.observe(document.body)
	resizeObserver.observe(document.documentElement)
	setCustomReady()
	showTemporarily()

	window.addEventListener('scroll', handleScroll, { passive: true, signal })
	window.addEventListener('resize', handleResize, { passive: true, signal })
	canHover.addEventListener('change', handleResize, { signal })
	reducedMotion.addEventListener('change', handleResize, { signal })
	shell.addEventListener('pointermove', handlePointerMove, { signal })
	shell.addEventListener('pointerleave', handlePointerLeave, { signal })
	shell.addEventListener('pointerdown', handlePointerDown, { signal })
	shell.addEventListener('pointerup', handlePointerUp, { signal })
	shell.addEventListener('pointercancel', handlePointerUp, { signal })
	shell.addEventListener('touchmove', preventTouchScroll, { passive: false, signal })
	document.addEventListener('astro:after-swap', handleAfterSwap, { signal })

	cleanup = () => {
		touchDragCleanup?.()
		abortController.abort()
		resizeObserver.disconnect()
		trackHeightAnim?.stop()
		thumbHeightAnim?.stop()
		thumbTravelAnim?.stop()
		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}
		shell.remove()
		tooltip.remove()
		document.body.classList.remove('custom-scrollbar-dragging')
		root.classList.remove('custom-scrollbar-ready', 'custom-scrollbar-scroll-driven', 'custom-scrollbar-js-driven', 'custom-scrollbar-native')
		root.style.removeProperty('--cs-track-top')
		root.style.removeProperty('--cs-track-height')
		root.style.removeProperty('--cs-thumb-height')
		root.style.removeProperty('--cs-thumb-travel')
	}
}
