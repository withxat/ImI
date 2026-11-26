import { disposeArticleBodies, initArticleBodies } from '@/client/article-reveal'
import { initAvatarPokes } from '@/client/avatar-poke'
import { disposeAll, registerModule, runAll } from '@/client/client-registry'
import { greetConsole } from '@/client/console-greeting'
import { destroyCustomScrollbar, initCustomScrollbar, refreshCustomScrollbarLayout } from '@/client/custom-scrollbar'
import { initEmailCopy } from '@/client/email-copy'
import { initIntroBadges } from '@/client/intro-badge'
import { disposeLinkedPageFontPrefetch, initLinkedPageFontPrefetch } from '@/client/linked-page-font-prefetch'
import { disposeMdxCopyButtons, initMdxCopyButtons } from '@/client/mdx-copy'
import { disposeNameAudioButtons, initNameAudioButtons } from '@/client/name-audio'
import { disposePageReveals, initPageReveals } from '@/client/page-reveal'
import { destroyPhotoSwipe, initPhotoSwipe } from '@/client/photoswipe-gallery'
import { disposePostOutline, initPostOutline } from '@/client/post-outline'
import { disposePrimeBindings, initPrimeBindings } from '@/client/prime-bindings'
import { runSiteStatsModule } from '@/client/site-stats'
import { initThemeSwitcher } from '@/client/theme-switcher'
import { initWordmarkHops } from '@/client/wordmark-hop'

function shouldAnimatePageEntrance() {
	return !matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Register all client modules
registerModule('page-reveal', {
	dispose: () => disposePageReveals(),
	init: animate => initPageReveals({ animate }),
})

registerModule('article-reveal', {
	dispose: () => disposeArticleBodies(),
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
	dispose: () => disposeNameAudioButtons(),
	init: () => initNameAudioButtons(),
})

registerModule('wordmark-hop', {
	init: () => initWordmarkHops(),
})

registerModule('avatar-poke', {
	init: () => initAvatarPokes(),
})

registerModule('email-copy', {
	init: () => initEmailCopy(),
})

registerModule('mdx-copy', {
	dispose: () => disposeMdxCopyButtons(),
	init: () => initMdxCopyButtons(),
})

registerModule('font-prefetch', {
	dispose: () => disposeLinkedPageFontPrefetch(),
	init: () => initLinkedPageFontPrefetch(),
})

registerModule('custom-scrollbar', {
	dispose: () => destroyCustomScrollbar(),
	init: () => initCustomScrollbar(),
})

// After custom-scrollbar: the post's section button opens the scrollbar's outline.
registerModule('post-outline', {
	dispose: () => disposePostOutline(),
	init: () => initPostOutline(),
})

// Only /design has specimens, so its code loads there instead of shipping on every page.
let designSpecimens: typeof import('@/client/design-specimens') | undefined

registerModule('design-specimens', {
	dispose: () => designSpecimens?.disposeDesignSpecimens(),
	init: () => {
		if (!document.querySelector('[data-color-token]'))
			return
		void import('@/client/design-specimens').then((mod) => {
			designSpecimens = mod
			mod.initDesignSpecimens()
		})
	},
})

// Only article pages need keyboard reading shortcuts.
let articleShortcuts: typeof import('@/client/article-shortcuts') | undefined

registerModule('article-shortcuts', {
	dispose: () => articleShortcuts?.disposeArticleShortcuts(),
	init: () => {
		if (!document.querySelector('.article-body'))
			return
		void import('@/client/article-shortcuts').then((mod) => {
			articleShortcuts = mod
			mod.initArticleShortcuts()
		})
	},
})

// Only the home page renders the tokens.ci pulse instrument.
let codingPulse: typeof import('@/client/coding-pulse') | undefined

registerModule('coding-pulse', {
	dispose: () => codingPulse?.disposeCodingPulse(),
	init: () => {
		if (!document.querySelector('[data-coding-pulse]'))
			return
		void import('@/client/coding-pulse').then((mod) => {
			codingPulse = mod
			mod.initCodingPulse()
		})
	},
})

// Footer is `transition:persist` per locale; `runSiteStatsModule` reconciles against the live DOM
// without tearing down polling on same-locale navigations.
registerModule('site-stats', {
	init: () => runSiteStatsModule(),
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

greetConsole()
