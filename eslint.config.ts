import { xat } from '@withxat/eslint-config'
import astro from 'eslint-plugin-astro'

const config = xat()

config.append({
	ignores: ['.source/**', 'dist/**'],
})

config.append({
	settings: {
		'better-tailwindcss': {
			detectComponentClasses: true,
			entryPoint: 'src/styles/globals.css',
		},
	},
})

config.append(astro.configs.recommended)

config.append({
	files: ['**/*.astro'],
	rules: {
		// Multi-line tailwind class strings on imported Astro components compile
		// to literal newlines inside JS template strings, which rolldown rejects
		// as unterminated. Keep classes on single lines for .astro files.
		'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
		// Custom CSS class names from scoped <style> blocks aren't visible to
		// the tailwind class scanner, so silence false positives here.
		'better-tailwindcss/no-unknown-classes': 'off',
	},
})

export default config
