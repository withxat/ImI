import { initArticleBodies } from '@/lib/article-reveal'
import { destroyCjkFontWeights, initCjkFontWeights } from '@/lib/cjk-font-weight-client'
import { disposeAll, registerModule, runAll } from '@/lib/client-registry'
import { destroyCustomScrollbar, initCustomScrollbar, refreshCustomScrollbarLayout } from '@/lib/custom-scrollbar-client'
import { initIntroBadges } from '@/lib/intro-badge-client'
import { initLinkedPageFontPrefetch } from '@/lib/linked-page-font-prefetch-client'
import { initMdxCopyButtons } from '@/lib/mdx-copy-client'
import { initNameAudioButtons } from '@/lib/name-audio-client'
import { initPageReveals } from '@/lib/page-reveal'
import { destroyPhotoSwipe, initPhotoSwipe } from '@/lib/photoswipe-gallery'
import { disposePrimeBindings, initPrimeBindings } from '@/lib/prime-bindings-client'
import { initThemeSwitcher } from '@/lib/theme-switcher-client'

function shouldAnimatePageEntrance() {
	return !matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Register all client modules
registerModule('page-reveal', {
	init: animate => initPageReveals({ animate }),
})

registerModule('article-reveal', {
	init: animate => initArticleBodies(animate),
})

registerModule('photoswipe', {
	dispose: () => destroyPhotoSwipe(),
	init: () => initPhotoSwipe(),
})

// Re-bind Prime UI widgets (dropdown-menu, hover-card, etc.) on each navigation.
// Must run before any module whose init dispatches Prime custom events (e.g.
// theme-switcher's `dropdown-menu:set` or intro-badges' `hover-card:set`).
// dispose tears down the document-level listeners each Prime factory installs,
// otherwise navigations would accumulate them and pin detached DOM in memory.
registerModule('prime-bindings', {
	dispose: () => disposePrimeBindings(),
	init: () => initPrimeBindings(),
})

registerModule('theme-switcher', {
	init: () => initThemeSwitcher(),
})

registerModule('intro-badges', {
	init: () => initIntroBadges(),
})

registerModule('name-audio', {
	init: () => initNameAudioButtons(),
})

registerModule('mdx-copy', {
	init: () => initMdxCopyButtons(),
})

registerModule('font-prefetch', {
	init: () => initLinkedPageFontPrefetch(),
})

registerModule('cjk-font-weights', {
	dispose: () => destroyCjkFontWeights(),
	init: () => initCjkFontWeights(),
})

registerModule('custom-scrollbar', {
	dispose: () => destroyCustomScrollbar(),
	init: () => initCustomScrollbar(),
})

// Dispose all modules before view transition swap
document.addEventListener('astro:before-swap', () => {
	disposeAll()
})

// Re-initialize all modules after each navigation (and once on first paint)
document.addEventListener('astro:page-load', () => {
	const animate = shouldAnimatePageEntrance()
	runAll(animate)
	refreshCustomScrollbarLayout()
})
