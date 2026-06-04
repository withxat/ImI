import { Buffer } from 'node:buffer'

import { PROFILE_AVATAR_SRC } from '@/lib/seo-data'

let avatarDataUrlPromise: Promise<string> | undefined

/** Fetched once per OG build; embedded as a data URL for Satori. */
export function loadOgAvatarDataUrl() {
	avatarDataUrlPromise ??= (async () => {
		const response = await fetch(PROFILE_AVATAR_SRC)
		if (!response.ok)
			throw new Error(`Failed to fetch OG avatar (${response.status})`)

		const bytes = Buffer.from(await response.arrayBuffer())
		const mime = response.headers.get('content-type')?.split(';')[0]?.trim() ?? 'image/png'
		return `data:${mime};base64,${bytes.toString('base64')}`
	})()

	return avatarDataUrlPromise
}
