import 'photoswipe/style.css'
import '@/components/article-photoswipe.css'

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

/** Delegated clicks on `<img>` inside the article root open PhotoSwipe. */
export function attachArticlePhotoswipe(root: HTMLElement): () => void {
	const onClick = (e: MouseEvent) => {
		if (e.defaultPrevented)
			return
		if (e.button !== 0)
			return
		if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
			return

		const el = e.target
		if (!(el instanceof HTMLImageElement))
			return
		if (!root.contains(el))
			return
		if (el.closest('a'))
			return
		if (el.hasAttribute('data-no-photoswipe'))
			return

		e.preventDefault()

		const { h, w } = dimensionsForImage(el)
		const src = el.currentSrc || el.src
		const msrc = el.currentSrc || el.src
		const srcset = el.srcset?.trim() ? el.srcset : undefined
		const sizes = el.sizes?.trim() ? el.sizes : undefined

		void (async () => {
			const { default: PhotoSwipe } = await import('photoswipe')
			const pswp = new PhotoSwipe({
				allowPanToNext: false,
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
						...(sizes ? { sizes } : {}),
						src,
						...(srcset ? { srcset } : {}),
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
			pswp.init()
		})()
	}

	root.addEventListener('click', onClick)
	return () => root.removeEventListener('click', onClick)
}
