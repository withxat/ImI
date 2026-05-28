/// <reference types="vite-plugin-font/src/font" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.css';

declare module '*.svg' {
	const src: string
	export default src
}

declare module '*.ttf?subsets' {
	export const css: {
		family: string
		style?: string
		weight?: string
	}
	export const fontFamilyFallback: string
}

declare module '*.ttf?subsets&key=content' {
	export * from '*.ttf?subsets'
}
