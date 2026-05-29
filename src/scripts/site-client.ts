import { initArticleBodies } from '@/lib/article-reveal'
import { disposeAll, registerModule, runAll } from '@/lib/client-registry'
import { initIntroBadges } from '@/lib/intro-badge-client'
import { initLinkedPageFontPrefetch } from '@/lib/linked-page-font-prefetch-client'
import { initMdxCopyButtons } from '@/lib/mdx-copy-client'
import { initNameAudioButtons } from '@/lib/name-audio-client'
import { initPageReveals } from '@/lib/page-reveal'
import { destroyPhotoSwipe, initPhotoSwipe } from '@/lib/photoswipe-gallery'
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

// Dispose all modules before view transition swap
document.addEventListener('astro:before-swap', () => {
	disposeAll()
})

// Re-initialize all modules after each navigation (and once on first paint)
document.addEventListener('astro:page-load', () => {
	const animate = shouldAnimatePageEntrance()
	runAll(animate)
})
