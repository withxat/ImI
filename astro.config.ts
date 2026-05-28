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

export default defineConfig({
	adapter: cloudflare(),
	integrations: [
		mdx({
			rehypePlugins: [
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
	},
})
