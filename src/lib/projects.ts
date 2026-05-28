import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

type ConfigEntry = CollectionEntry<'config'>

export type Capability = ConfigEntry['data']['capabilities'][number]

let capabilitiesPromise: Promise<Capability[]> | undefined

async function readCapabilities(): Promise<Capability[]> {
	const entries = await getCollection('config') as ConfigEntry[]
	const entry = entries[0]
	return entry ? entry.data.capabilities : []
}

export function getCapabilities(): Promise<Capability[]> {
	capabilitiesPromise ??= readCapabilities()
	return capabilitiesPromise
}
