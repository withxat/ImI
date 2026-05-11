'use client'

import * as React from 'react'

import { useConfig } from '@/components/mdx/hooks/use-config'
import { Tabs } from '@/components/mdx/ui/tabs'

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
	const [config, setConfig] = useConfig()

	const installationType = React.useMemo(() => {
		return config.installationType || 'cli'
	}, [config])

	return (
		<Tabs
			onValueChange={value =>
				setConfig({ ...config, installationType: value as 'cli' | 'manual' })}
			className="relative mt-6 w-full"
			value={installationType}
		>
			{children}
		</Tabs>
	)
}
