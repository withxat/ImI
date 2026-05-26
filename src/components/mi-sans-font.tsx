import { css, fontFamilyFallback } from '@/assets/mi-sans-vf.ttf?subsets'
import { css as serifCss, fontFamilyFallback as serifFontFamilyFallback } from '@/assets/source-han-serif-sc-vf.ttf?subsets'

const sansFontStack = `"Hanken Grotesk", ${css.family}, ${fontFamilyFallback}`
const serifFontStack = `${serifCss.family}, ${serifFontFamilyFallback}`

export function MiSansFontStyles() {
	return (
		<style>
			{`
				html {
					--font-display: ${sansFontStack};
					--font-serif: ${serifFontStack};
					--font-text: ${sansFontStack};
					--font-ui: ${sansFontStack};
				}
			`}
		</style>
	)
}
