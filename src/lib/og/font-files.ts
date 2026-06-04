/** Paths relative to repo root — OG build only (Satori needs static woff/ttf, not VF/woff2). */
export const OG_FONT_FILES = {
	fugaz: './node_modules/@fontsource/fugaz-one/files/fugaz-one-latin-400-normal.woff',
	hanken: {
		400: './node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff',
		500: './node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff',
		600: './node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff',
	},
	/** No @fontsource/misans — project static instances from the MiSans pipeline. */
	miSans: {
		400: './src/assets/fonts/mi-sans-wght-415.ttf',
		500: './src/assets/fonts/mi-sans-wght-415.ttf',
		600: './src/assets/fonts/mi-sans-wght-500.ttf',
	},
} as const
