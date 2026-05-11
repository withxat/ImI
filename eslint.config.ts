import { xat } from '@withxat/eslint-config'

const config = xat()

config.append({
	ignores: ['.source/**', 'dist/**', 'src/pages.gen.ts'],
})

config.append({
	settings: {
		'better-tailwindcss': {
			detectComponentClasses: true,
			entryPoint: 'src/styles/globals.css',
		},
	},
})

config.append({
	files: ['src/pages/**/*.{ts,tsx}'],
	rules: {
		'react-refresh/only-export-components': [
			'error',
			{ allowExportNames: ['getConfig'] },
		],
	},
})

config.append({
	files: ['src/components/ui/**/*.{ts,tsx}'],
	rules: {
		'react-refresh/only-export-components': [
			'error',
			{ allowExportNames: ['badgeVariants', 'buttonVariants'] },
		],
	},
})

config.append({
	files: ['src/components/mdx/**/*.{ts,tsx}'],
	rules: {
		'react-refresh/only-export-components': 'off',
	},
})

export default config
