'use client'

import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export function CapabilityExternalLink({
	description,
	href,
	title,
}: {
	description: string
	href: string
	title: string
}) {
	return (
		<Button
			className={cn(
				`
					h-auto min-h-0 w-full items-center justify-start gap-3 rounded-xl px-4 py-3.5 text-left
					font-normal shadow-none
				`,
				'hover:text-foreground',
			)}
			render={<a href={href} rel="noreferrer" target="_blank" />}
			variant="outline"
		>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			<ArrowUpRight className="-mx-0.5 size-4 shrink-0 text-muted-foreground opacity-80" aria-hidden />
		</Button>
	)
}
