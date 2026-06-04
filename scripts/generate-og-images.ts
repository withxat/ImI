import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { loadOgAvatarDataUrl } from '@/lib/og/avatar'
import { OG_SITE_DEFAULT } from '@/lib/og/constants'
import { OG_STATIC_PAGE_FILES, OG_STATIC_PAGES } from '@/lib/og/pages'
import { loadZhPostsForOg, toPostOgContent } from '@/lib/og/posts'
import { renderOgPng } from '@/lib/og/render'
import { pageOgTemplate, postOgTemplate, siteOgTemplate } from '@/lib/og/template'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = join(root, 'public/og')
const postOutDir = join(outDir, 'post')
const pagesOutDir = join(outDir, 'pages')

function writePng(path: string, png: Uint8Array) {
	mkdirSync(dirname(path), { recursive: true })
	writeFileSync(path, png)
}

async function main() {
	const avatarSrc = await loadOgAvatarDataUrl()

	const defaultPng = await renderOgPng(siteOgTemplate({
		avatarSrc,
		eyebrow: OG_SITE_DEFAULT.eyebrow,
		summary: OG_SITE_DEFAULT.summary,
	}))
	writePng(join(outDir, 'default.png'), defaultPng)

	for (const pageId of Object.keys(OG_STATIC_PAGES) as Array<keyof typeof OG_STATIC_PAGES>) {
		const copy = OG_STATIC_PAGES[pageId]
		const png = await renderOgPng(pageOgTemplate({
			avatarSrc,
			header: copy.header,
			summary: copy.summary,
			title: copy.title,
		}))
		writePng(join(pagesOutDir, `${OG_STATIC_PAGE_FILES[pageId]}.png`), png)
	}

	const posts = loadZhPostsForOg()
	for (const post of posts) {
		const png = await renderOgPng(postOgTemplate({
			...toPostOgContent(post),
			avatarSrc,
		}))
		writePng(join(postOutDir, `${post.slug}.png`), png)
	}

	const pageCount = Object.keys(OG_STATIC_PAGES).length
	console.info(
		`[og] wrote default.png, ${pageCount} page image(s), and ${posts.length} post image(s) to public/og/`,
	)
}

main().catch((error) => {
	console.error('[og] generation failed:', error)
	process.exit(1)
})
