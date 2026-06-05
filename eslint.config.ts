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

config.append({
	ignores: ['public/emoji/**/*.svg'],
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

// Treat src/components/ui/ as vendored bejamas prime components.
// They use PascalCase filenames and intentionally-stacked Tailwind classes
// that conflict with our stricter project conventions. Keep them re-pullable.
config.append({
	files: ['src/components/ui/**/*.{ts,astro}'],
	rules: {
		'better-tailwindcss/no-conflicting-classes': 'off',
		'better-tailwindcss/no-unknown-classes': 'off',
		'perfectionist/sort-exports': 'off',
		'style/indent': 'off',
		'style/no-mixed-spaces-and-tabs': 'off',
		'style/quotes': 'off',
		'style/semi': 'off',
		'unicorn/filename-case': 'off',
	},
})

export default config
