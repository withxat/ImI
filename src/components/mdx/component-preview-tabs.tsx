'use client'

import * as React from 'react'

import { Tabs, TabsList, TabsTab } from '@/components/mdx/ui/tabs'
import { cn } from '@/lib/cn'

export function ComponentPreviewTabs({
	align = 'center',
	className,
	component,
	hideCode = false,
	source,
	...props
}: React.ComponentProps<'div'> & {
	align?: 'center' | 'end' | 'start'
	component: React.ReactNode
	hideCode?: boolean
	source: React.ReactNode
}) {
	const [tab, setTab] = React.useState('preview')

	return (
		<div
			className={cn('group relative mt-4 mb-12 flex flex-col gap-2', className)}
			{...props}
		>
			<Tabs onValueChange={setTab} value={tab}>
				<div className="flex items-center justify-between">
					{!hideCode && (
						<TabsList className="
							bg-transparent p-0
							*:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none
						"
						>
							<TabsTab className="rounded-lg" value="preview">
								Preview
							</TabsTab>
							<TabsTab className="rounded-lg" value="code">
								Code
							</TabsTab>
						</TabsList>
					)}
				</div>
			</Tabs>
			<div
				className="
					relative rounded-xl border
					not-dark:bg-card
				"
				data-tab={tab}
			>
				<div
					className="
						invisible
						data-[active=true]:visible
					"
					data-active={tab === 'preview'}
				>
					<div
						className="
							flex h-[450px] w-full justify-center overflow-y-auto p-10
							data-[align=center]:items-center
							data-[align=end]:items-end
							data-[align=start]:items-start
							max-sm:px-6
						"
						data-align={align}
					>
						<div data-slot="preview">{component}</div>
					</div>
				</div>
				<div
					className="
						absolute inset-0 hidden overflow-hidden
						data-[active=true]:block
						**:[figure]:m-0!
						**:[pre]:h-[450px]
					"
					data-active={tab === 'code'}
					data-slot="code"
				>
					{source}
				</div>
			</div>
		</div>
	)
}
