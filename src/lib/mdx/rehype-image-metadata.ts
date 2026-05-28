import type { Plugin } from 'unified'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { getPixels } from '@unpic/pixels'
import { blurhashToDataUri } from '@unpic/placeholder'
import { encode } from 'blurhash'

const CLOUDFLARE_IMAGE_HOST = 'assets.xat.sh'
const IMAGE_METADATA_CACHE_PATH = join('content', 'image-metadata-cache.json')

interface ImageMetadata {
	blurhash: string
	height: number
	placeholder: string
	width: number
}

interface HastElement {
	children?: HastElement[]
	properties?: Record<string, unknown>
	tagName?: string
	type: string
}

let imageMetadataCachePromise: Promise<Map<string, ImageMetadata>> | undefined
const pendingImageMetadata = new Map<string, Promise<ImageMetadata | undefined>>()

function cloudflareImageUrl(src: string, operations: Record<string, number | string>) {
	const url = new URL(src)
	const modifiers = Object.entries(operations)
		.map(([key, value]) => `${key}=${value}`)
		.join(',')
	return `${url.origin}/cdn-cgi/image/${modifiers}${url.pathname}`
}

function isCloudflareImageUrl(src: string) {
	try {
		return new URL(src).hostname === CLOUDFLARE_IMAGE_HOST
	}
	catch {
		return false
	}
}

async function readImageMetadataCache() {
	try {
		const raw = await readFile(IMAGE_METADATA_CACHE_PATH, 'utf8')
		const parsed = JSON.parse(raw) as Record<string, ImageMetadata>
		return new Map(Object.entries(parsed))
	}
	catch {
		return new Map<string, ImageMetadata>()
	}
}

function getImageMetadataCache() {
	imageMetadataCachePromise ??= readImageMetadataCache()
	return imageMetadataCachePromise
}

async function writeImageMetadataCache(cache: Map<string, ImageMetadata>) {
	const sorted = Object.fromEntries([...cache.entries()].sort(([a], [b]) => a.localeCompare(b)))
	await mkdir(dirname(IMAGE_METADATA_CACHE_PATH), { recursive: true })
	await writeFile(IMAGE_METADATA_CACHE_PATH, `${JSON.stringify(sorted, null, '\t')}\n`)
}

async function createImageMetadata(src: string): Promise<ImageMetadata | undefined> {
	if (!isCloudflareImageUrl(src))
		return undefined

	const cache = await getImageMetadataCache()
	const cached = cache.get(src)
	if (cached)
		return cached

	const pending = pendingImageMetadata.get(src)
	if (pending)
		return pending

	const next = (async () => {
		const metadataResponse = await fetch(cloudflareImageUrl(src, { format: 'json' }))
		if (!metadataResponse.ok) {
			throw new Error(`Failed to read image metadata for ${src}: ${metadataResponse.status}`)
		}

		const dimensions = await metadataResponse.json() as { height: number, width: number }
		const tinyUrl = cloudflareImageUrl(src, { format: 'jpeg', quality: 40, width: 32 })
		const { data, height, width } = await getPixels(tinyUrl)
		const blurhash = encode(Uint8ClampedArray.from(data), width, height, 4, 4)

		const imageMetadata = {
			blurhash,
			height: dimensions.height,
			placeholder: blurhashToDataUri(blurhash),
			width: dimensions.width,
		}

		cache.set(src, imageMetadata)
		await writeImageMetadataCache(cache)
		return imageMetadata
	})()

	pendingImageMetadata.set(src, next)
	try {
		return await next
	}
	finally {
		pendingImageMetadata.delete(src)
	}
}

async function walkHast(node: HastElement, visit: (node: HastElement) => Promise<void>): Promise<void> {
	await visit(node)
	for (const child of node.children ?? []) {
		await walkHast(child, visit)
	}
}

export const rehypeImageMetadata: Plugin<[], HastElement> = () => {
	return async (tree: HastElement) => {
		await walkHast(tree, async (node) => {
			if (node.type !== 'element' || node.tagName !== 'img')
				return

			const src = node.properties?.src
			if (typeof src !== 'string')
				return

			const metadata = await createImageMetadata(src)
			if (!metadata)
				return

			node.properties = {
				...node.properties,
				height: metadata.height,
				placeholder: metadata.placeholder,
				width: metadata.width,
			}
		})
	}
}
