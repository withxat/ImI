import { xat } from '@withxat/eslint-config'

const config = xat()

config.append({
	ignores: ['src/pages.gen.ts'],
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

export default config
