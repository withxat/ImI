import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import mdx from 'fumadocs-mdx/vite'
import { defineConfig } from 'waku/config'

import * as MdxConfig from './source.config'

export default defineConfig({
	vite: {
		plugins: [
			mdx(MdxConfig),
			tailwindcss(),
			react(),
			babel({ presets: [reactCompilerPreset()] }),
		],
		resolve: {
			tsconfigPaths: true,
		},
	},
})
