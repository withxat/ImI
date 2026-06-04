import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { loadOgAvatarDataUrl } from '@/lib/og/avatar'
import { OG_SITE_DEFAULT } from '@/lib/og/constants'
import { loadZhPostsForOg, toPostOgContent } from '@/lib/og/posts'
import { renderOgPng } from '@/lib/og/render'
import { postOgTemplate, siteOgTemplate } from '@/lib/og/template'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = join(root, 'public/og')
const postOutDir = join(outDir, 'post')

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

	const posts = loadZhPostsForOg()
	for (const post of posts) {
		const png = await renderOgPng(postOgTemplate({
			...toPostOgContent(post),
			avatarSrc,
		}))
		writePng(join(postOutDir, `${post.slug}.png`), png)
	}

	console.info(`[og] wrote default.png and ${posts.length} post image(s) to public/og/`)
}

main().catch((error) => {
	console.error('[og] generation failed:', error)
	process.exit(1)
})
