import type { OgStaticPage } from '@/lib/og/pages'

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { renderOgPng } from './og-render.ts'
import { LOCALES } from '@/lib/i18n/constants'
import { loadOgAvatarDataUrl } from '@/lib/og/avatar'
import { OG_STATIC_PAGE_FILES, ogSiteDefaultFor, ogStaticPagesFor } from '@/lib/og/pages'
import { loadPostsForOg, toPostOgContent } from '@/lib/og/posts'
import { pageOgTemplate, postOgTemplate, siteOgTemplate } from '@/lib/og/template'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = join(root, 'public/og')

function writePng(path: string, png: Uint8Array) {
	mkdirSync(dirname(path), { recursive: true })
	writeFileSync(path, png)
}

async function main() {
	const avatarSrc = await loadOgAvatarDataUrl()
	rmSync(outDir, { force: true, recursive: true })

	let totalPages = 0
	let totalPosts = 0

	for (const locale of LOCALES) {
		const localeDir = join(outDir, locale)
		const defaultCopy = ogSiteDefaultFor(locale)
		const defaultPng = await renderOgPng(siteOgTemplate({
			avatarSrc,
			eyebrow: defaultCopy.eyebrow,
			summary: defaultCopy.summary,
		}))
		writePng(join(localeDir, 'default.png'), defaultPng)

		const staticPages = ogStaticPagesFor(locale)
		for (const pageId of Object.keys(staticPages) as OgStaticPage[]) {
			const copy = staticPages[pageId]
			const png = await renderOgPng(pageOgTemplate({
				avatarSrc,
				header: copy.header,
				summary: copy.summary,
				title: copy.title,
			}))
			writePng(join(localeDir, 'pages', `${OG_STATIC_PAGE_FILES[pageId]}.png`), png)
			totalPages++
		}

		const posts = loadPostsForOg(locale)
		for (const post of posts) {
			const png = await renderOgPng(postOgTemplate({
				...toPostOgContent(post),
				avatarSrc,
			}))
			writePng(join(localeDir, 'post', `${post.slug}.png`), png)
			totalPosts++
		}
	}

	console.info(
		`[og] wrote ${LOCALES.length} default, ${totalPages} page, and ${totalPosts} post image(s) to public/og/`,
	)
}

main().catch((error) => {
	console.error('[og] generation failed:', error)
	process.exit(1)
})
