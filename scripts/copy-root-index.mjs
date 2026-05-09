/**
 * Waku SSG writes the home route to dist/public/pages/index.html.
 * Cloudflare static assets serve "/" from dist/public/index.html first; without it,
 * "/" falls through to the Worker RSC fallback (minimal shell → blank page).
 */
import fs from 'node:fs'
import path from 'node:path'

const src = path.join('dist', 'public', 'pages', 'index.html')
const dest = path.join('dist', 'public', 'index.html')

if (!fs.existsSync(src)) {
	console.warn('[copy-root-index] Missing static homepage:', src)
	process.exit(1)
}

fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.copyFileSync(src, dest)
console.log('[copy-root-index]', dest)
