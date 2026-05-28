/**
 * One-off build script: render nucleo-flags React icons to static SVG files.
 * Run: node scripts/extract-nucleo-flag-svgs.mjs
 * Requires nucleo-flags (dev: react + react-dom for this script only).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as NucleoFlags from 'nucleo-flags'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mapPath = join(root, 'src/lib/nucleo-flag-map.ts')
const outDir = join(root, 'src/assets/flags')

const mapSource = readFileSync(mapPath, 'utf8')
const entries = [...mapSource.matchAll(/^\t([A-Z]{2}):\s*'(Icon[^']+)'/gm)]

if (!entries.length) {
	console.error('No ISO entries found in nucleo-flag-map.ts')
	process.exit(1)
}

mkdirSync(outDir, { recursive: true })

let written = 0
let failed = 0

for (const match of entries) {
	const iso = match[1]
	const iconName = match[2]
	const outPath = join(outDir, `${iso.toLowerCase()}.svg`)
	try {
		const Icon = NucleoFlags[iconName]
		if (!Icon) {
			console.warn(`Missing export ${iconName} for ${iso}`)
			failed++
			continue
		}
		const svg = renderToStaticMarkup(
			createElement(Icon, { height: '32', size: '32', width: '32' }),
		)
		writeFileSync(outPath, svg)
		written++
	}
	catch (err) {
		console.warn(`Failed ${iso} (${iconName}):`, err.message)
		failed++
	}
}

console.log(`Wrote ${written} SVGs to src/assets/flags (${failed} failed)`)
