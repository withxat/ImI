import { fileURLToPath } from 'node:url'

import { createJiti } from 'jiti'

await createJiti(import.meta.url, {
	alias: {
		'@': fileURLToPath(new URL('../src', import.meta.url)),
	},
}).import('./generate-og-images.ts')
