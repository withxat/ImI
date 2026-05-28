import { cloudflare } from '@cloudflare/vite-plugin'
import contentCollections from '@content-collections/vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import Font from 'vite-plugin-font'
import { defineConfig } from 'waku/config'

export default defineConfig({
	vite: {
		plugins: [
			contentCollections(),
			Font.vite({
				scanFiles: {
					content: [
						'content/**/*.{json,md,mdx}',
					],
					default: [
						'src/**/*.{css,ts,tsx}',
					],
				},
				whiteList: '，。！？、；：「」『』（）《》—…·￥',
			}),
			tailwindcss(),
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			cloudflare({
				inspectorPort: false,
				viteEnvironment: {
					childEnvironments: ['ssr'],
					name: 'rsc',
				},
			}),
		],
		resolve: {
			tsconfigPaths: true,
		},
		server: {
			forwardConsole: true,
		},
	},
})
