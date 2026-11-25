import { animate } from 'motion'

import { jumpToSection } from '@/client/section-jump'

type AnimationControls = ReturnType<typeof animate>

interface SectionMarker {
	button: HTMLButtonElement
	element: HTMLElement
	/** The section title beside the marker, shown while the outline is open. */
	label: HTMLButtonElement
	title: string
	y: number
}

/** `peek` follows a hover and closes with it; `pinned` stays until a jump, a scroll, Esc, or a click elsewhere. */
export type SectionOutlineMode = 'peek' | 'pinned'

const HOTZONE_WIDTH = 24
const MIN_TRACK_WIDTH = 768
const SHELL_OFFSET_PX = 12
const SHELL_VISIBILITY_DURATION = 0.16
const TRACK_TOP = 14
const THUMB_TOUCH_HIT_SLOP = 18
const MIN_THUMB_HEIGHT = 44
const HIDE_DELAY = 1600
const MARKER_HIT_RADIUS = 9
const DRAG_TOOLTIP_OFFSET_MAX = 18
/** Narrower than this, or without a fine pointer, outline labels would cover the text: they become chips over a scrim. */
const OUTLINE_INLINE_MIN_WIDTH = 1240
/** Scrolling this far closes an open outline. */
const OUTLINE_CLOSE_SCROLL = 40

/** Marks the control that opens the outline, so a click on it is not a click outside. */
export const SECTION_OUTLINE_TRIGGER = 'data-section-outline-trigger'
/** Fired on `document` with the new mode (or null) as `detail`. */
export const SECTION_OUTLINE_CHANGE = 'section-outline:change'
export const SECTION_OUTLINE_ID = 'section-outline'

const SCROLLBAR_NAV_LABEL: { en: string } & Record<string, string> = {
	en: 'Page sections',
	ja: 'ページのセクション',
	zh: '页面章节',
}

let cleanup: (() => void) | null = null
let refreshLayout: (() => void) | null = null
let outline: null | {
	close: () => void
	mode: () => null | SectionOutlineMode
	open: (mode: SectionOutlineMode, focus: boolean) => boolean
} = null

export function refreshCustomScrollbarLayout() {
	refreshLayout?.()
}

/**
 * Shows the scrollbar with each section's title beside its marker. `focus` moves keyboard focus to
 * the current section's title. Returns false when there is nothing to show: the custom scrollbar is
 * off (reduced motion), or the page has no sections or does not scroll.
 */
export function openSectionOutline(mode: SectionOutlineMode, focus = false) {
	return outline?.open(mode, focus) ?? false
}

export function closeSectionOutline() {
	outline?.close()
}

export function sectionOutlineMode() {
	return outline?.mode() ?? null
}

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

function collectSectionMarkers(markersHost: HTMLElement, outlineHost: HTMLElement): SectionMarker[] {
	// A heading inside a nav, such as the links to more writing after a post, is not a section of the page.
	return Array.from(document.querySelectorAll<HTMLElement>('main h2:not(nav h2)'))
		.filter(element => (element.textContent?.trim() ?? '').length > 0)
		.map((element, index) => {
			const title = element.textContent!.trim()
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'custom-scrollbar-marker'
			button.setAttribute('aria-label', title)
			button.dataset.title = title
			markersHost.appendChild(button)

			const label = document.createElement('button')
			label.type = 'button'
			label.className = 'custom-scrollbar-outline-label'
			label.textContent = title
			label.style.setProperty('--outline-index', String(index))
			outlineHost.appendChild(label)
			return { button, element, label, title, y: 0 }
		})
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
	document.body.appendChild(tooltip)
	return tooltip
}

function getScrollbarNavLabel() {
	const locale = document.querySelector<HTMLElement>('[data-site-locale]')?.dataset.siteLocale ?? 'en'
	return SCROLLBAR_NAV_LABEL[locale] ?? SCROLLBAR_NAV_LABEL.en
}

function createScrollbarShell() {
	const shell = document.createElement('div')
	shell.className = 'custom-scrollbar'
	shell.setAttribute('role', 'navigation')
	shell.setAttribute('aria-label', getScrollbarNavLabel())
	shell.style.setProperty('--cs-hotzone-width', `${HOTZONE_WIDTH}px`)

	const trackShadow = document.createElement('div')
	trackShadow.className = 'custom-scrollbar-track-shadow'
	trackShadow.setAttribute('aria-hidden', 'true')

	const track = document.createElement('div')
	track.className = 'custom-scrollbar-track'
	track.setAttribute('aria-hidden', 'true')

	const thumb = document.createElement('div')
	thumb.className = 'custom-scrollbar-thumb'
	thumb.setAttribute('aria-hidden', 'true')

	const markersHost = document.createElement('div')
	markersHost.className = 'custom-scrollbar-markers'

	const surface = document.createElement('div')
	surface.className = 'custom-scrollbar-surface'
	for (const node of [trackShadow, track, thumb, markersHost])
		surface.appendChild(node)
	shell.appendChild(surface)

	// Outside the surface, so the labels run their own entrance instead of the shell's slide.
	const outlineHost = document.createElement('div')
	outlineHost.className = 'custom-scrollbar-outline'
	outlineHost.id = SECTION_OUTLINE_ID
	outlineHost.inert = true
	shell.appendChild(outlineHost)
	document.body.appendChild(shell)

	const scrim = document.createElement('div')
	scrim.className = 'custom-scrollbar-scrim'
	scrim.setAttribute('aria-hidden', 'true')
	document.body.appendChild(scrim)

	return { markersHost, outlineHost, scrim, shell, surface, thumb, track, trackShadow }
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

	const { markersHost, outlineHost, scrim, shell, surface, thumb } = createScrollbarShell()
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
	let shellVisibilityAnim: AnimationControls | null = null
	let shellVisibilityProgress = 0
	let leaveFallbackTimer = 0
	let suppressShowUntil = 0
	let visible = false
	let outlineMode: null | SectionOutlineMode = null
	let outlineScrollY = 0

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

	const markers = collectSectionMarkers(markersHost, outlineHost)
	const resizeObserver = new ResizeObserver(() => {
		measure()
		if (visible || hover || dragging) {
			showTemporarily()
		}
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

	function clearShellVisibilityInlineStyles() {
		surface.style.removeProperty('opacity')
		surface.style.removeProperty('transform')
		surface.style.removeProperty('transform-origin')
		shell.style.removeProperty('opacity')
		shell.style.removeProperty('right')
		shell.style.removeProperty('transform')
	}

	function clearLeaveState() {
		shell.classList.remove('is-leaving')
	}

	function applyShellVisibilityProgress(progress: number) {
		shellVisibilityProgress = clamp(progress, 0, 1)
		surface.style.opacity = String(shellVisibilityProgress)
		surface.style.transform = `translate3d(${(1 - shellVisibilityProgress) * SHELL_OFFSET_PX}px, 0, 0)`
	}

	function setShellSurfaceVisibilityStyle(nextVisible: boolean) {
		applyShellVisibilityProgress(nextVisible ? 1 : 0)
	}

	function stopShellVisibilityAnimation() {
		if (!shellVisibilityAnim) {
			return
		}

		shellVisibilityAnim.stop()
		shellVisibilityAnim = null
	}

	function animateShellVisibility(nextVisible: boolean, onComplete?: () => void) {
		stopShellVisibilityAnimation()
		const targetProgress = nextVisible ? 1 : 0

		if (Math.abs(shellVisibilityProgress - targetProgress) < 0.01) {
			applyShellVisibilityProgress(targetProgress)
			onComplete?.()
			return
		}

		const animation = animate(shellVisibilityProgress, targetProgress, {
			duration: SHELL_VISIBILITY_DURATION,
			ease: [0.22, 1, 0.36, 1],
			onComplete: () => {
				if (shellVisibilityAnim !== animation) {
					return
				}

				shellVisibilityAnim = null
				onComplete?.()
			},
			onUpdate: applyShellVisibilityProgress,
		})
		shellVisibilityAnim = animation
	}

	function commitShellVisibility() {
		stopShellVisibilityAnimation()
		clearShellVisibilityInlineStyles()
		if (visible) {
			shellVisibilityProgress = 1
			clearLeaveState()
			shell.classList.add('is-visible')
			return
		}

		if (shell.classList.contains('is-leaving')) {
			return
		}

		shell.classList.remove('is-visible')
		shellVisibilityProgress = 0
		clearLeaveState()
		syncShellAccessibility()
	}

	function showShell() {
		suppressShowUntil = 0
		clearLeaveFallback()

		if (visible && shell.classList.contains('is-visible') && !shell.classList.contains('is-leaving')) {
			return
		}

		const wasLeaving = shell.classList.contains('is-leaving')
		stopShellVisibilityAnimation()
		clearLeaveState()
		if (!wasLeaving) {
			setShellSurfaceVisibilityStyle(false)
		}
		visible = true
		shell.classList.add('is-visible')
		syncShellAccessibility()
		animateShellVisibility(true)
	}

	function clearLeaveFallback() {
		if (leaveFallbackTimer) {
			window.clearTimeout(leaveFallbackTimer)
			leaveFallbackTimer = 0
		}
	}

	function hideShell() {
		if (shell.classList.contains('is-leaving')) {
			return
		}

		if (!visible && !shell.classList.contains('is-visible')) {
			return
		}

		visible = false
		clearLeaveFallback()

		if (reducedMotion.matches) {
			stopShellVisibilityAnimation()
			clearShellVisibilityInlineStyles()
			shell.classList.remove('is-visible')
			clearLeaveState()
			syncShellAccessibility()
			return
		}

		if (!shell.classList.contains('is-visible')) {
			return
		}

		shell.classList.add('is-leaving')
		setShellSurfaceVisibilityStyle(true)
		animateShellVisibility(false, finishLeave)

		leaveFallbackTimer = window.setTimeout(() => {
			leaveFallbackTimer = 0
			if (shell.classList.contains('is-leaving')) {
				finishLeave()
			}
		}, SHELL_VISIBILITY_DURATION * 1000 + 80)
	}

	function finishLeave() {
		clearLeaveFallback()
		stopShellVisibilityAnimation()
		applyShellVisibilityProgress(0)
		clearLeaveState()
		shell.classList.remove('is-visible')
		clearShellVisibilityInlineStyles()
		suppressShowUntil = performance.now() + SHELL_VISIBILITY_DURATION * 1000 + 80
		syncShellAccessibility()
	}

	function setVisible(nextVisible: boolean) {
		if (nextVisible) {
			if (visible && shell.classList.contains('is-visible') && !shell.classList.contains('is-leaving')) {
				return
			}

			showShell()
			return
		}

		if (!visible && !shell.classList.contains('is-visible') && !shell.classList.contains('is-leaving')) {
			return
		}

		hideShell()
	}

	function setInteracting(interacting: boolean) {
		shell.classList.toggle('is-active', interacting)
		shell.classList.toggle('is-dragging', dragging)
		syncShellAccessibility()
	}

	function syncShellAccessibility() {
		const { maxScroll } = getScrollMetrics()
		const canUseScrollbar = maxScroll > 1 && shell.classList.contains('has-scroll')
		const isInteractive = canUseScrollbar && (
			shell.classList.contains('is-visible')
			|| shell.classList.contains('is-active')
			|| shell.classList.contains('is-dragging')
			|| dragging
			|| hover
			|| outlineMode !== null
		)

		if (isInteractive)
			shell.removeAttribute('inert')
		else
			shell.setAttribute('inert', '')
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

		for (const marker of markers) {
			const absoluteTop = marker.element.getBoundingClientRect().top + window.scrollY
			marker.y = TRACK_TOP + clamp(absoluteTop / Math.max(1, scrollHeight), 0, 1) * trackHeight
			marker.button.style.top = `${marker.y}px`
		}

		if (!hasScroll) {
			setVisible(false)
		}

		syncThumbFromScroll()
		updateMarkerStates()
		layoutOutline()
		syncShellAccessibility()
	}

	function resyncScrollTimeline() {
		if (!scrollDriven) {
			syncThumbFromScroll()
			return
		}

		thumb.style.removeProperty('transform')
		root.classList.remove('custom-scrollbar-scroll-driven')
		void document.documentElement.offsetHeight
		root.classList.add('custom-scrollbar-scroll-driven')
		syncThumbFromScroll()
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

	function syncLayout() {
		measure()
		commitShellVisibility()
		resyncScrollTimeline()
		updateMarkerStates()
	}

	function showTemporarily(options: { active?: boolean, fromScroll?: boolean } = {}) {
		const { maxScroll } = getScrollMetrics()
		if (maxScroll <= 1) {
			return
		}

		if (shell.classList.contains('is-leaving') && !options.active && !hover && !dragging) {
			return
		}

		if (options.fromScroll && performance.now() < suppressShowUntil) {
			return
		}

		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}

		showShell()
		setInteracting(options.active || hover || dragging || outlineMode !== null)

		hideTimer = window.setTimeout(() => {
			if (!dragging && !hover && !outlineMode) {
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

	function dragTooltipY(marker: SectionMarker) {
		const thumbCenter = thumbTop + thumbHeight / 2
		const offset = clamp(thumbCenter - marker.y, -DRAG_TOOLTIP_OFFSET_MAX, DRAG_TOOLTIP_OFFSET_MAX)
		return marker.y + offset
	}

	function findMarkerAt(clientY: number) {
		return markers.find(marker => Math.abs(marker.y - clientY) <= MARKER_HIT_RADIUS) ?? null
	}

	function findMarkerInsideThumb() {
		const thumbBottom = thumbTop + thumbHeight
		const thumbCenter = thumbTop + thumbHeight / 2
		return markers
			.filter(marker => marker.y >= thumbTop - 4 && marker.y <= thumbBottom + 4)
			.sort((a, b) => Math.abs(a.y - thumbCenter) - Math.abs(b.y - thumbCenter))[0] ?? null
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
			marker.label.classList.toggle('is-current', isInside)
		}
	}

	/**
	 * Stacks the labels beside their markers: each starts centered on its marker, is pushed down
	 * past the one above, then pushed back up from the bottom edge if the stack overflows.
	 */
	function layoutOutline() {
		if (!outlineMode) {
			return
		}

		const overlay = !canHover.matches || window.innerWidth < OUTLINE_INLINE_MIN_WIDTH
		outlineHost.classList.toggle('is-overlay', overlay)
		scrim.classList.toggle('is-visible', overlay && outlineMode === 'pinned')

		const gap = overlay ? 8 : 4
		const heights = markers.map(marker => marker.label.offsetHeight)
		const tops: number[] = []
		let floor = TRACK_TOP - gap
		markers.forEach((marker, index) => {
			const top = Math.max(marker.y - heights[index]! / 2, floor + gap)
			tops.push(top)
			floor = top + heights[index]!
		})
		let ceiling = window.innerHeight - TRACK_TOP + gap
		for (let index = markers.length - 1; index >= 0; index--) {
			tops[index] = Math.min(tops[index]!, ceiling - gap - heights[index]!)
			ceiling = tops[index]!
		}
		markers.forEach((marker, index) => {
			marker.label.style.top = `${Math.max(TRACK_TOP, tops[index]!)}px`
		})
	}

	function setHoveredSection(hovered: null | SectionMarker) {
		for (const item of markers) {
			item.button.classList.toggle('is-hovered', item === hovered)
			item.label.classList.toggle('is-hovered', item === hovered)
		}
	}

	function notifyOutline() {
		document.dispatchEvent(new CustomEvent(SECTION_OUTLINE_CHANGE, { detail: outlineMode }))
	}

	function openOutline(mode: SectionOutlineMode, focus: boolean) {
		if (markers.length === 0 || !shell.classList.contains('has-scroll')) {
			return false
		}

		// A hover never downgrades an outline the reader pinned.
		if (outlineMode === 'pinned' && mode === 'peek') {
			return true
		}

		const changed = outlineMode !== mode
		outlineMode = mode
		outlineScrollY = window.scrollY
		shell.classList.add('is-outline')
		outlineHost.inert = false
		markersHost.setAttribute('aria-hidden', 'true')
		updateTooltip(null)
		updateMarkerStates()
		layoutOutline()
		showTemporarily({ active: true })

		if (focus) {
			const current = markers.find(marker => marker.label.classList.contains('is-current')) ?? markers[0]!
			current.label.focus({ preventScroll: true })
		}
		if (changed) {
			notifyOutline()
		}
		return true
	}

	function closeOutline() {
		if (!outlineMode) {
			return
		}

		outlineMode = null
		shell.classList.remove('is-outline')
		outlineHost.inert = true
		markersHost.removeAttribute('aria-hidden')
		scrim.classList.remove('is-visible')
		setHoveredSection(null)
		showTemporarily()
		notifyOutline()
	}

	function focusOutlineTrigger() {
		document.querySelector<HTMLElement>(`[${SECTION_OUTLINE_TRIGGER}]`)?.focus()
	}

	function handleOutlineKeydown(event: KeyboardEvent) {
		if (!outlineMode) {
			return
		}

		const labels = markers.map(marker => marker.label)
		const index = labels.indexOf(document.activeElement as HTMLButtonElement)
		if (event.key === 'Escape') {
			closeOutline()
			if (index >= 0) {
				focusOutlineTrigger()
			}
			return
		}
		if (index < 0) {
			return
		}

		// Tab leaves the outline from its trigger, so focus moves on as if the outline were not there.
		if (event.key === 'Tab') {
			closeOutline()
			focusOutlineTrigger()
			return
		}

		const next = {
			ArrowDown: Math.min(index + 1, labels.length - 1),
			ArrowUp: Math.max(index - 1, 0),
			End: labels.length - 1,
			Home: 0,
		}[event.key]
		if (next !== undefined) {
			event.preventDefault()
			labels[next]!.focus({ preventScroll: true })
		}
	}

	function handleOutsidePointerDown(event: PointerEvent) {
		const target = event.target as Element
		if (!outlineMode || shell.contains(target) || target.closest(`[${SECTION_OUTLINE_TRIGGER}]`)) {
			return
		}
		closeOutline()
	}

	function updateDragTooltip() {
		const marker = findMarkerInsideThumb()
		updateTooltip(marker, marker ? dragTooltipY(marker) : 0)
	}

	function handleScroll() {
		if (outlineMode && Math.abs(window.scrollY - outlineScrollY) > OUTLINE_CLOSE_SCROLL) {
			closeOutline()
		}
		showTemporarily({ fromScroll: true })
		if (!scrollDriven) {
			syncThumbFromScroll()
		}
		else {
			const { maxScroll, scrollTop } = getScrollMetrics()
			thumbTop = TRACK_TOP + (maxScroll > 1 ? (scrollTop / maxScroll) * thumbTravel : 0)
		}
		updateMarkerStates()
		if (dragging) {
			updateDragTooltip()
		}
	}

	function handlePointerMove(event: PointerEvent) {
		showTemporarily()
		hover = true
		setInteracting(true)
		document.body.classList.toggle('custom-scrollbar-dragging', dragging)

		const label = (event.target as Element).closest('.custom-scrollbar-outline-label')
		if (label) {
			setHoveredSection(markers.find(marker => marker.label === label) ?? null)
			return
		}

		if (dragging) {
			event.preventDefault()
			scrollToClientY(event.clientY)
			syncThumbFromScroll()
			updateMarkerStates()
			updateDragTooltip()
		}
		else {
			const marker = findMarkerAt(event.clientY)
			setHoveredSection(marker)
			// With the outline open the title is already beside the marker.
			updateTooltip(outlineMode ? null : marker, event.clientY)
		}
	}

	function handlePointerLeave() {
		hover = false
		setHoveredSection(null)
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
			scrollToClientY(event.touches[0]!.clientY)
			syncThumbFromScroll()
			updateMarkerStates()
			updateDragTooltip()
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
		updateTooltip(null)
		showTemporarily()
	}

	function handlePointerDown(event: PointerEvent) {
		// Labels are plain buttons; their clicks must not become thumb drags or track jumps.
		if (event.button !== 0 || (event.target as Element).closest('.custom-scrollbar-outline')) {
			return
		}

		syncThumbFromScroll()
		const allowsTrackClick = supportsTrackHover(canHover)
		const isTouchLike = event.pointerType === 'touch' || !allowsTrackClick
		const isThumbPress = isPointInsideThumb(event.clientY, isTouchLike ? THUMB_TOUCH_HIT_SLOP : 0)
		const marker = findMarkerAt(event.clientY)
		const isTouch = event.pointerType === 'touch'

		if (marker) {
			event.preventDefault()
			if (!isTouch) {
				shell.setPointerCapture(event.pointerId)
			}
			activePointerId = event.pointerId
			updateTooltip(null)
			dragging = false
			closeOutline()
			jumpToSection(marker.element)
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
			updateDragTooltip()
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
		if (visible || hover || dragging) {
			showTemporarily()
		}
	}

	for (const marker of markers) {
		// Pointer presses jump in handlePointerDown; this covers keyboard activation.
		marker.button.addEventListener('click', (event) => {
			event.preventDefault()
			if (event.detail !== 0) {
				return
			}
			jumpToSection(marker.element)
			showTemporarily()
		}, { signal })

		marker.label.addEventListener('click', (event) => {
			closeOutline()
			jumpToSection(marker.element)
			// Keyboard focus follows the jump, so the next Tab continues inside that section.
			if (event.detail === 0) {
				const target = marker.element.querySelector<HTMLElement>('a[href]')
					?? (marker.element.tabIndex >= 0 ? marker.element : null)
				target?.focus({ preventScroll: true })
			}
		}, { signal })
	}

	outline = {
		close: closeOutline,
		mode: () => outlineMode,
		open: openOutline,
	}

	refreshLayout = syncLayout
	resizeObserver.observe(document.body)
	resizeObserver.observe(document.documentElement)
	setCustomReady()
	syncLayout()
	syncShellAccessibility()

	// Scroll restoration / late layout can land after first measure.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			syncLayout()
		})
	})
	window.addEventListener('pageshow', syncLayout, { signal })

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
	document.addEventListener('keydown', handleOutlineKeydown, { signal })
	document.addEventListener('pointerdown', handleOutsidePointerDown, { capture: true, signal })

	cleanup = () => {
		if (outlineMode) {
			outlineMode = null
			notifyOutline()
		}
		outline = null
		refreshLayout = null
		touchDragCleanup?.()
		abortController.abort()
		resizeObserver.disconnect()
		trackHeightAnim?.stop()
		thumbHeightAnim?.stop()
		thumbTravelAnim?.stop()
		stopShellVisibilityAnimation()
		clearLeaveFallback()
		clearLeaveState()
		clearShellVisibilityInlineStyles()
		if (hideTimer) {
			window.clearTimeout(hideTimer)
		}
		shell.remove()
		scrim.remove()
		tooltip.remove()
		document.body.classList.remove('custom-scrollbar-dragging')
		root.classList.remove('custom-scrollbar-ready', 'custom-scrollbar-scroll-driven', 'custom-scrollbar-js-driven', 'custom-scrollbar-native')
		root.style.removeProperty('--cs-track-top')
		root.style.removeProperty('--cs-track-height')
		root.style.removeProperty('--cs-thumb-height')
		root.style.removeProperty('--cs-thumb-travel')
	}
}
