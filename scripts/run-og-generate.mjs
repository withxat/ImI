import { fileURLToPath } from 'node:url'

import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, {
	alias: {
		'@': fileURLToPath(new URL('../src', import.meta.url)),
	},
})

await jiti.import('./generate-og-images.ts')
