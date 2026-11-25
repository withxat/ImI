import type PhotoSwipe from 'photoswipe'
import type { SlideData } from 'photoswipe'

const ARTICLE_ROOT_SELECTOR = '[data-article-reveal], [data-article-plain]'

const CLOSE_SVG = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
/* PhotoSwipe mirrors the next arrow's icon (`scale(-1, 1)`), so both arrows take this left chevron. */
const ARROW_SVG = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>'

type ArticleSlide = SlideData & {
	caption: string
	element: HTMLImageElement
}

function isZoomableImage(el: Element): el is HTMLImageElement {
	return el instanceof HTMLImageElement
		&& !el.closest('a')
		&& !el.hasAttribute('data-no-photoswipe')
}

function getArticleImages(articleRoot: Element): HTMLImageElement[] {
	return [...articleRoot.querySelectorAll('img')].filter(isZoomableImage)
}

function captionForImage(img: HTMLImageElement): string {
	const figcaption = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim()
	return figcaption || img.alt.trim()
}

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

function slideFromImage(img: HTMLImageElement): ArticleSlide {
	const { h: thumbH, w: thumbW } = dimensionsForImage(img)
	const thumbSrc = img.currentSrc || img.src
	const { h, src, w } = readFullSize(img, thumbW, thumbH)
	return {
		alt: img.alt,
		caption: captionForImage(img),
		element: img,
		height: h,
		msrc: thumbSrc,
		src,
		width: w,
	}
}

function readLightboxLabels(articleRoot: HTMLElement) {
	return {
		close: articleRoot.dataset.lightboxClose || 'Close image',
		next: articleRoot.dataset.lightboxNext || 'Next image',
		prev: articleRoot.dataset.lightboxPrev || 'Previous image',
		zoom: articleRoot.dataset.lightboxZoom || 'View larger image',
	}
}

let activePswp: null | PhotoSwipe = null
let abortController: AbortController | null = null

async function openPhotoSwipe(target: HTMLImageElement, articleRoot: HTMLElement, openedByKeyboard: boolean) {
	const images = getArticleImages(articleRoot)
	const startIndex = Math.max(0, images.indexOf(target))
	const slides = (images.length > 0 ? images : [target]).map(slideFromImage)
	const isGallery = slides.length > 1
	const hasAnyCaption = slides.some(slide => slide.caption.length > 0)
	const labels = readLightboxLabels(articleRoot)
	const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

	if (activePswp) {
		activePswp.destroy()
		activePswp = null
	}

	const [{ default: PhotoSwipe }] = await Promise.all([
		import('photoswipe'),
		import('@/styles/photoswipe.css'),
	])

	const pswp = new PhotoSwipe({
		allowPanToNext: isGallery,
		appendToEl: document.body,
		arrowKeys: isGallery,
		arrowNext: isGallery,
		arrowNextSVG: ARROW_SVG,
		arrowNextTitle: labels.next,
		arrowPrev: isGallery,
		arrowPrevSVG: ARROW_SVG,
		arrowPrevTitle: labels.prev,
		bgClickAction: 'close',
		bgOpacity: 0.92,
		close: true,
		closeSVG: CLOSE_SVG,
		closeTitle: labels.close,
		counter: false,
		dataSource: slides,
		escKey: true,
		index: startIndex,
		loop: false,
		mainClass: 'pswp--article-minimal',
		padding: {
			bottom: isGallery || hasAnyCaption ? 64 : 24,
			left: isGallery && finePointer ? 64 : 16,
			right: isGallery && finePointer ? 64 : 16,
			top: 52,
		},
		showHideAnimationType: 'zoom',
		zoom: false,
	})

	pswp.on('uiRegister', () => {
		pswp.ui?.registerElement({
			appendTo: 'root',
			className: 'pswp__article-caption pswp__hide-on-close',
			name: 'article-caption',
			onInit: (el, pswpInstance) => {
				const textEl = document.createElement('span')
				const counterEl = document.createElement('span')
				counterEl.className = 'pswp__article-counter'
				el.appendChild(textEl)
				el.appendChild(counterEl)

				const update = () => {
					const slide = slides[pswpInstance.currIndex]
					const caption = slide?.caption ?? ''
					textEl.textContent = caption
					textEl.hidden = caption.length === 0
					counterEl.textContent = isGallery ? `${pswpInstance.currIndex + 1} / ${slides.length}` : ''
					counterEl.hidden = !isGallery
					el.hidden = !caption && !isGallery
				}

				pswpInstance.on('change', update)
				update()
			},
			order: 9,
		})
	})

	let lastIndex = startIndex
	pswp.on('change', () => {
		lastIndex = pswp.currIndex
	})

	activePswp = pswp

	pswp.on('destroy', () => {
		if (activePswp === pswp) {
			activePswp = null
		}
		if (openedByKeyboard) {
			const returnTarget = slides[lastIndex]?.element
			if (returnTarget && document.contains(returnTarget)) {
				returnTarget.focus({ preventScroll: true })
			}
		}
	})

	pswp.init()
}

function handleArticleClick(e: MouseEvent) {
	if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
		return

	const el = e.target
	if (!(el instanceof Element) || !isZoomableImage(el))
		return

	const articleRoot = el.closest<HTMLElement>(ARTICLE_ROOT_SELECTOR)
	if (!articleRoot)
		return

	e.preventDefault()
	void openPhotoSwipe(el, articleRoot, false)
}

function handleArticleKeydown(e: KeyboardEvent) {
	if (e.defaultPrevented || (e.key !== 'Enter' && e.key !== ' '))
		return

	const el = e.target
	if (!(el instanceof Element) || !isZoomableImage(el))
		return

	const articleRoot = el.closest<HTMLElement>(ARTICLE_ROOT_SELECTOR)
	if (!articleRoot)
		return

	e.preventDefault()
	void openPhotoSwipe(el, articleRoot, true)
}

/** Initialize PhotoSwipe lightbox with multi-image grouping, captions, and keyboard access. */
export function initPhotoSwipe() {
	destroyPhotoSwipe()

	const ac = new AbortController()
	abortController = ac
	const { signal } = ac

	for (const articleRoot of document.querySelectorAll<HTMLElement>(ARTICLE_ROOT_SELECTOR)) {
		const { zoom } = readLightboxLabels(articleRoot)
		for (const img of getArticleImages(articleRoot)) {
			img.tabIndex = 0
			img.setAttribute('role', 'button')
			const caption = captionForImage(img)
			img.setAttribute('aria-label', caption ? `${zoom}: ${caption}` : zoom)
		}
	}

	document.body.addEventListener('click', handleArticleClick, { signal })
	document.body.addEventListener('keydown', handleArticleKeydown, { signal })
}

/** Cleanup active instance and event listeners. */
export function destroyPhotoSwipe() {
	if (activePswp) {
		activePswp.destroy()
		activePswp = null
	}

	abortController?.abort()
	abortController = null
}
