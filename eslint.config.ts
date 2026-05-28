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
		'no-restricted-imports': ['error', {
			patterns: [{
				group: ['@/*', '@/**'],
				message: 'Use ec.config.mjs or relative imports; @/ is not resolved when loading astro.config.ts.',
			}],
		}],
	},
})

export default config
