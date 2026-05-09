'use client'

import { Factory } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export function CapabilityEmptyPlaceholder({
	description,
	title,
}: {
	description: string
	title: string
}) {
	return (
		<div
			className={cn(
				buttonVariants({ variant: 'outline' }),
				`
					pointer-events-none h-auto min-h-0 w-full cursor-default items-center justify-start gap-3 rounded-xl px-4
					py-3.5 text-left font-normal whitespace-normal shadow-none
				`,
			)}
			role="status"
		>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			<Factory className="-mx-0.5 size-4 shrink-0 text-muted-foreground opacity-80" aria-hidden />
		</div>
	)
}
