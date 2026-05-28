const HANKEN = '"Hanken Grotesk"'

let loadPromise: null | Promise<void> = null

export function ensureMiSansFont() {
	if (loadPromise)
		return loadPromise

	loadPromise = (async () => {
		try {
			const { css, fontFamilyFallback } = await import('@/assets/mi-sans-vf.ttf?subsets')
			const stack = `${HANKEN}, ${css.family}, ${fontFamilyFallback}`
			document.documentElement.style.setProperty('--font-display', stack)
			document.documentElement.style.setProperty('--font-text', stack)
			document.documentElement.style.setProperty('--font-ui', stack)
		}
		catch {}
	})()

	return loadPromise
}
