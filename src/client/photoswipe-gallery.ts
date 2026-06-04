import type PhotoSwipe from 'photoswipe'

function dimensionsForImage(img: HTMLImageElement) {
	const rect = img.getBoundingClientRect()
	let w = img.naturalWidth
	let h = img.naturalHeight
	if (!w || !h) {
		const dpr = window.devicePixelRatio || 1
		w = Math.max(1, Math.round(rect.width * dpr))
		h = Math.max(1, Math.round(rect.height * dpr))
	}
	return { h, w }
}

let activePswp: null | PhotoSwipe = null
let bodyClickHandler: ((e: MouseEvent) => void) | null = null

function handleBodyClick(e: MouseEvent) {
	if (e.defaultPrevented)
		return
	if (e.button !== 0)
		return
	if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
		return

	const el = e.target
	if (!(el instanceof HTMLImageElement))
		return
	if (el.closest('a'))
		return
	if (el.hasAttribute('data-no-photoswipe'))
		return

	// Only handle images inside article bodies
	const articleRoot = el.closest('[data-article-reveal], [data-article-plain]')
	if (!articleRoot)
		return

	e.preventDefault()
	openPhotoSwipe(el)
}

function readFullSize(el: HTMLImageElement, fallbackW: number, fallbackH: number) {
	const fullSrc = el.dataset.pswpFullsrc?.trim()
	if (!fullSrc) {
		return {
			h: fallbackH,
			src: el.currentSrc || el.src,
			w: fallbackW,
		}
	}

	const dataW = Number(el.dataset.pswpWidth)
	const dataH = Number(el.dataset.pswpHeight)
	return {
		h: dataH > 0 ? dataH : fallbackH,
		src: fullSrc,
		w: dataW > 0 ? dataW : fallbackW,
	}
}

async function openPhotoSwipe(el: HTMLImageElement) {
	const { h: thumbH, w: thumbW } = dimensionsForImage(el)
	const thumbSrc = el.currentSrc || el.src
	const { h, src, w } = readFullSize(el, thumbW, thumbH)
	const msrc = thumbSrc

	// Close any existing instance first
	if (activePswp) {
		activePswp.destroy()
		activePswp = null
	}

	const { default: PhotoSwipe } = await import('photoswipe')
	const pswp = new PhotoSwipe({
		allowPanToNext: false,
		appendToEl: document.body,
		arrowKeys: false,
		arrowNext: false,
		arrowPrev: false,
		bgClickAction: 'close',
		bgOpacity: 0.72,
		close: false,
		counter: false,
		dataSource: [
			{
				alt: el.alt,
				element: el,
				height: h,
				msrc,
				src,
				width: w,
			},
		],
		escKey: true,
		index: 0,
		loop: false,
		mainClass: 'pswp--article-minimal',
		showHideAnimationType: 'zoom',
		zoom: false,
	})

	activePswp = pswp

	pswp.on('destroy', () => {
		if (activePswp === pswp) {
			activePswp = null
		}
	})

	pswp.init()
}

/** Initialize PhotoSwipe with a single delegated body click handler */
export function initPhotoSwipe() {
	// Remove existing handler if any
	destroyPhotoSwipe()

	// Single delegated handler on body
	bodyClickHandler = handleBodyClick
	document.body.addEventListener('click', bodyClickHandler)
}

/** Cleanup everything */
export function destroyPhotoSwipe() {
	// Destroy active instance
	if (activePswp) {
		activePswp.destroy()
		activePswp = null
	}

	// Remove body click handler
	if (bodyClickHandler) {
		document.body.removeEventListener('click', bodyClickHandler)
		bodyClickHandler = null
	}
}
