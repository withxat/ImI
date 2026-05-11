'use client'

import * as React from 'react'

interface Config {
	installationType: 'cli' | 'manual'
	packageManager: 'bun' | 'npm' | 'pnpm' | 'yarn'
}

const DEFAULT_CONFIG: Config = {
	installationType: 'cli',
	packageManager: 'pnpm',
}

const STORAGE_KEY = 'config'

function readConfig(): Config {
	if (typeof window === 'undefined') {
		return DEFAULT_CONFIG
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG
	}
	catch {
		return DEFAULT_CONFIG
	}
}

export function useConfig(): [Config, React.Dispatch<React.SetStateAction<Config>>] {
	const [config, setConfig] = React.useState<Config>(readConfig)

	const setPersistedConfig = React.useCallback<React.Dispatch<React.SetStateAction<Config>>>(
		(value) => {
			setConfig((current) => {
				const next = typeof value === 'function' ? value(current) : value

				try {
					window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
				}
				catch {
					// Storage persistence is a convenience; component state still updates.
				}

				return next
			})
		},
		[],
	)

	return [config, setPersistedConfig]
}
