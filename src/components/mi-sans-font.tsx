import { css, fontFamilyFallback } from '@/assets/mi-sans-vf.ttf?subsets'

const zhFontStack = `${css.family}, ${fontFamilyFallback}`

export function MiSansFontStyles() {
	return (
		<style>
			{`
				html:lang(zh) {
					--font-display: ${zhFontStack};
					--font-serif: ${zhFontStack};
					--font-text: ${zhFontStack};
					--font-ui: ${zhFontStack};
				}
			`}
		</style>
	)
}
