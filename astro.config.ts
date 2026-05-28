import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig } from 'astro/config'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkGfm from 'remark-gfm'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import Font from 'vite-plugin-font'

const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`
const copyIconUrl = `url("data:image/svg+xml,${encodeURIComponent(copyIconSvg)}")`

export default defineConfig({
	adapter: cloudflare(),
	integrations: [
		expressiveCode({
			defaultProps: {
				wrap: false,
			},
			emitExternalStylesheet: true,
			frames: {
				showCopyToClipboardButton: true,
			},
			styleOverrides: {
				borderColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)',
				borderRadius: '0.75rem',
				borderWidth: '1px',
				codeFontFamily: 'var(--font-mono)',
				frames: {
					copyIcon: copyIconUrl,
					editorActiveTabIndicatorTopColor: 'transparent',
					frameBoxShadowCssValue: 'none',
					inlineButtonBackground: 'rgba(255, 255, 255, 0.06)',
					inlineButtonBackgroundHoverOrFocusOpacity: '1',
					inlineButtonBackgroundIdleOpacity: '1',
					inlineButtonBorder: 'rgba(255, 255, 255, 0.12)',
					inlineButtonBorderOpacity: '1',
					inlineButtonForeground: 'rgba(255, 255, 255, 0.88)',
					shadowColor: 'transparent',
					tooltipSuccessBackground: 'transparent',
					tooltipSuccessForeground: 'transparent',
				},
				uiFontFamily: 'var(--font-ui)',
			},
			themeCssSelector: theme => (theme.type === 'dark' ? 'html.dark' : 'html:not(.dark)'),
			themes: ['vesper'],
			useDarkModeMediaQuery: false,
		}),
		mdx({
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
