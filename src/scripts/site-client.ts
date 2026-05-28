import { initArticleBodies } from '@/lib/article-reveal'
import { consumeClientNavigationPending, onAstroPageLoad } from '@/lib/astro-page-lifecycle'
import { initIntroBadges } from '@/lib/intro-badge-client'
import { initMdxCopyButtons } from '@/lib/mdx-copy-client'
import { initNameAudioButtons } from '@/lib/name-audio-client'
import { initPageReveals } from '@/lib/page-reveal'
import { attachArticlePhotoswipe } from '@/lib/photoswipe-gallery'
import { initThemeSwitcher } from '@/lib/theme-switcher-client'

const photoswipeDisposers = new Map<HTMLElement, () => void>()

function shouldAnimatePageEntrance() {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches)
		return false
	return !consumeClientNavigationPending()
}

function runPageClient() {
	const animate = shouldAnimatePageEntrance()

	initPageReveals({ animate })
	initArticleBodies(animate)

	const articleRoots = new Set(
		document.querySelectorAll<HTMLElement>('[data-article-reveal], [data-article-plain]'),
	)
	for (const [root, dispose] of photoswipeDisposers) {
		if (!articleRoots.has(root)) {
			dispose()
			photoswipeDisposers.delete(root)
		}
	}
	for (const root of articleRoots) {
		if (photoswipeDisposers.has(root))
			continue
		photoswipeDisposers.set(root, attachArticlePhotoswipe(root))
	}

	initThemeSwitcher()
	initIntroBadges()
	initNameAudioButtons()
	initMdxCopyButtons()
}

onAstroPageLoad(runPageClient)
