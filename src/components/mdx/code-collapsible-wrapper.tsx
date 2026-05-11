'use client'

import * as React from 'react'

import { Button } from '@/components/mdx/ui/button'
import {
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
} from '@/components/mdx/ui/collapsible'
import { Separator } from '@/components/mdx/ui/separator'
import { cn } from '@/lib/cn'

export function CodeCollapsibleWrapper({
	children,
	className,
	...props
}: React.ComponentProps<typeof Collapsible>) {
	const [isOpened, setIsOpened] = React.useState(false)

	return (
		<Collapsible
			className={cn(`
				group/collapsible relative
				md:-mx-1
			`, className)}
			onOpenChange={setIsOpened}
			open={isOpened}
			{...props}
		>
			<div className="absolute top-1.5 right-10 z-10 flex items-center">
				<CollapsibleTrigger
					render={(
						<Button className="text-muted-foreground" variant="ghost">
							{isOpened ? 'Collapse' : 'Expand'}
						</Button>
					)}
				/>
				<Separator className="mx-1.5 h-5" orientation="vertical" />
			</div>
			<CollapsiblePanel
				className="
					relative mt-6 h-full overflow-hidden
					data-closed:max-h-64
					[&>figure]:mt-0
					[&>figure]:md:mx-0!
				"
				hidden={false}
				keepMounted
			>
				{children}
			</CollapsiblePanel>
			<CollapsibleTrigger className="
				absolute inset-x-0 -bottom-2 flex h-20 cursor-pointer items-center justify-center rounded-b-lg bg-linear-to-b
				from-transparent via-background via-50% to-background text-sm font-medium text-muted-foreground transition-colors
				group-data-open/collapsible:hidden
				hover:text-foreground
			"
			>
				{isOpened ? 'Collapse' : 'Expand'}
			</CollapsibleTrigger>
		</Collapsible>
	)
}
