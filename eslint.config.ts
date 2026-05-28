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

export default config
