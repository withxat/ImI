import type * as React from 'react'

import { ComponentPreviewTabs } from '@/components/mdx/component-preview-tabs'
import { ComponentSource } from '@/components/mdx/component-source'
import { cn } from '@/lib/cn'

interface ComponentPreviewProps
	extends Omit<React.ComponentProps<'div'>, 'ref'> {
	align?: 'center' | 'end' | 'start'
	description?: string
	hideCode?: boolean
	name: string
}

export function ComponentPreview({
	align = 'center',
	className,
	hideCode = false,
	name,
	...props
}: ComponentPreviewProps) {
	const component = (
		<p className="text-sm text-muted-foreground">
			Component
			{' '}
			<code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem]">
				{name}
			</code>
			{' '}
			not found in registry.
		</p>
	)

	return (
		<ComponentPreviewTabs
			align={align}
			className={cn(className)}
			component={component}
			hideCode={hideCode}
			source={<ComponentSource collapsible={false} name={name} />}
			{...props}
		/>
	)
}
