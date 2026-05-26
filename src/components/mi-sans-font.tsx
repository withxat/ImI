import { css, fontFamilyFallback } from '@/assets/mi-sans-vf.ttf?subsets'

const sansFontStack = `"Hanken Grotesk", ${css.family}, ${fontFamilyFallback}`

export function MiSansFontStyles() {
	return (
		<style>
			{`
				html {
					--font-display: ${sansFontStack};
					--font-text: ${sansFontStack};
					--font-ui: ${sansFontStack};
				}
			`}
		</style>
	)
}
