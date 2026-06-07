import type { ChangeFreqEnum } from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig } from 'astro/config'
import { createJiti } from 'jiti'
import rehypeFluentEmoji from 'rehype-fluent-emoji'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkGfm from 'remark-gfm'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import Font from 'vite-plugin-font'

const jiti = createJiti(import.meta.url, {
	alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url)),
	},
})

const { getExpressiveCodeBlockLocale } = await jiti.import<typeof import('./src/lib/expressive-code.ts')>(
	'./src/lib/expressive-code.ts',
)
const { default: cjkFontPolish } = await jiti.import<typeof import('./src/lib/fonts/cjk-font-polish.ts')>(
	'./src/lib/fonts/cjk-font-polish.ts',
)
const { default: misansGlyphCollector, MISANS_GLYPH_SCAN_FILES } = await jiti.import<typeof import('./src/lib/fonts/mi-sans-glyph-collector.ts')>(
	'./src/lib/fonts/mi-sans-glyph-collector.ts',
)
const { buildSitemapData, normalizeSitemapPathname } = await jiti.import<typeof import('./src/lib/sitemap-build.ts')>(
	'./src/lib/sitemap-build.ts',
)
const sitemapBuild = await buildSitemapData()
const commitSha = getCommitSha()

function getCommitSha() {
	try {
		return execFileSync('git', ['rev-parse', '--short=6', 'HEAD'], {
			encoding: 'utf8',
		}).trim()
	}
	catch {
		return 'dev'
	}
}

function fluentEmoji(): AstroIntegration {
	return {
		hooks: {
			'astro:config:setup': ({ config, updateConfig }) => {
				updateConfig({
					markdown: {
						rehypePlugins: [
							[rehypeFluentEmoji, {
								assetBase: '/emoji',
								className: 'fluent-emoji',
								style: '3d',
							}],
							...config.markdown.rehypePlugins,
						],
					},
				})
			},
		},
		name: 'imi-fluent-emoji',
	}
}

export default defineConfig({
	adapter: cloudflare(),
	image: {
		domains: ['assets.xat.sh', 'avatars.githubusercontent.com', 'github.com', 'raw.githubusercontent.com'],
	},
	integrations: [
		expressiveCode({
			defaultLocale: 'en',
			defaultProps: {
				wrap: false,
			},
			emitExternalStylesheet: true,
			frames: {
				showCopyToClipboardButton: true,
			},
			getBlockLocale: getExpressiveCodeBlockLocale,
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
		fluentEmoji(),
		mdx({
			remarkPlugins: [
				remarkGfm,
				remarkCjkFriendly,
				remarkCjkFriendlyGfmStrikethrough,
			],
		}),
		sitemap({
			customPages: sitemapBuild.customPages,
			filter: (page) => {
				const { pathname } = new URL(page)
				if (pathname !== '/' && pathname.endsWith('/'))
					return false
				return sitemapBuild.allowedPathnames.has(normalizeSitemapPathname(page))
			},
			namespaces: {
				image: false,
				news: false,
				video: false,
				xhtml: false,
			},
			serialize(item) {
				const meta = sitemapBuild.metaByPathname.get(normalizeSitemapPathname(item.url))
				if (!meta)
					return undefined

				item.changefreq = meta.changefreq as ChangeFreqEnum
				item.priority = meta.priority
				if (meta.lastmod)
					item.lastmod = meta.lastmod.toISOString()

				return item
			},
		}),
	],
	output: 'server',
	site: 'https://xat.sh',
	vite: {
		define: {
			'import.meta.env.PUBLIC_IMI_COMMIT_SHA': JSON.stringify(commitSha),
		},
		plugins: [
			tailwindcss(),
			Icons({
				autoInstall: true,
				compiler: 'astro',
				customCollections: {
					local: FileSystemIconLoader('./src/assets/icons'),
				},
			}),
			misansGlyphCollector(),
			Font.vite({
				scanFiles: MISANS_GLYPH_SCAN_FILES,
			}),
			cjkFontPolish(),
		],
	},
})
