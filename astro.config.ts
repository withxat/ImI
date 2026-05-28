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
					editorActiveTabIndicatorTopColor: 'transparent',
					frameBoxShadowCssValue: 'none',
					inlineButtonBackground: 'rgba(255, 255, 255, 0.06)',
					inlineButtonBackgroundHoverOrFocusOpacity: '1',
					inlineButtonBackgroundIdleOpacity: '1',
					inlineButtonBorder: 'rgba(255, 255, 255, 0.12)',
					inlineButtonBorderOpacity: '1',
					inlineButtonForeground: 'rgba(255, 255, 255, 0.85)',
					shadowColor: 'transparent',
					tooltipSuccessBackground: 'color-mix(in oklab, var(--foreground) 14%, var(--code))',
					tooltipSuccessForeground: 'color-mix(in oklab, var(--code-foreground) 88%, var(--foreground))',
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
