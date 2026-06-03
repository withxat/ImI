import { initArticleBodies } from '@/client/article-reveal'
import { disposeAll, registerModule, runAll } from '@/client/client-registry'
import { destroyCustomScrollbar, initCustomScrollbar, refreshCustomScrollbarLayout } from '@/client/custom-scrollbar'
import { disposeDesignWandererPreview, initDesignWandererPreview } from '@/client/design-wanderer-preview'
import { initIntroBadges } from '@/client/intro-badge'
import { initLinkedPageFontPrefetch } from '@/client/linked-page-font-prefetch'
import { initMdxCopyButtons } from '@/client/mdx-copy'
import { initNameAudioButtons } from '@/client/name-audio'
import { initPageReveals } from '@/client/page-reveal'
import { destroyPhotoSwipe, initPhotoSwipe } from '@/client/photoswipe-gallery'
import { disposePrimeBindings, initPrimeBindings } from '@/client/prime-bindings'
import { initThemeSwitcher } from '@/client/theme-switcher'

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

registerModule('custom-scrollbar', {
	dispose: () => destroyCustomScrollbar(),
	init: () => initCustomScrollbar(),
})

registerModule('design-wanderer-preview', {
	dispose: () => disposeDesignWandererPreview(),
	init: () => initDesignWandererPreview(),
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
