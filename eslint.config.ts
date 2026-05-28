import { xat } from '@withxat/eslint-config'

const config = xat()

config.append({
	settings: {
		'better-tailwindcss': {
			detectComponentClasses: true,
			entryPoint: 'src/styles/globals.css',
		},
	},
})

// Vite loads astro.config.ts before path aliases exist — @/ imports break CI builds.
config.append({
	files: ['astro.config.ts'],
	rules: {
		// Alias rewrite breaks Cloudflare config bootstrap (see lefthook: lint-astro-config skips --fix).
		'import-x/no-relative-packages': 'off',
		'no-restricted-imports': ['error', {
			patterns: [{
				group: ['@/*', '@/**'],
				message: 'Use ./src/... relative imports; @/ is not resolved when loading astro.config.ts.',
			}],
		}],
	},
})

export default config
