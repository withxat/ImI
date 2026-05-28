import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkGfm from 'remark-gfm'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import Font from 'vite-plugin-font'

// Relative path because this file is loaded before vite tsconfigPaths resolution.
// eslint-disable-next-line paths/import-alias
import { rehypeImageMetadata } from './src/lib/mdx/rehype-image-metadata'

export default defineConfig({
	adapter: cloudflare(),
	image: {
		// Cloudflare workers cannot run sharp; only optimize at build time
		// for prerendered pages.
		service: { entrypoint: 'astro/assets/services/compile' },
	},
	integrations: [
		mdx({
			rehypePlugins: [
				rehypeImageMetadata,
				[
					rehypePrettyCode,
					{
						bypassInlineCode: true,
						defaultLang: 'plaintext',
						keepBackground: false,
						theme: 'vesper',
					},
				],
			],
			remarkPlugins: [
				remarkGfm,
				remarkCjkFriendly,
				remarkCjkFriendlyGfmStrikethrough,
			],
		}),
	],
	output: 'server',
	site: 'https://xat.sh',
	vite: {
		plugins: [
			tailwindcss(),
			Icons({
				autoInstall: true,
				compiler: 'astro',
				customCollections: {
					// Local SVGs are loaded by file name (e.g. `~icons/local/arrow-up-right`).
					local: FileSystemIconLoader('./src/assets/icons'),
				},
			}),
			Font.vite({
				scanFiles: {
					content: ['content/**/*.{json,md,mdx}'],
					default: ['src/**/*.{astro,css,ts}'],
				},
				whiteList: '，。！？、；：「」『』（）《》—…·￥',
			}),
		],
		resolve: {
			tsconfigPaths: true,
		},
	},
})
