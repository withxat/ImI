'use client'

import type { MouseEvent } from 'react'

import type { ArrowUpRightIconHandle } from '@/components/ui/arrow-up-right'

import { useCallback, useRef } from 'react'

import { ArrowUpRightIcon } from '@/components/ui/arrow-up-right'
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
	const arrowRef = useRef<ArrowUpRightIconHandle>(null)

	const onRowEnter = useCallback((_e: MouseEvent) => {
		arrowRef.current?.startAnimation()
	}, [])

	const onRowLeave = useCallback((_e: MouseEvent) => {
		arrowRef.current?.stopAnimation()
	}, [])

	return (
		<Button
			className={cn(
				`
					h-auto min-h-0 w-full items-center justify-start gap-3 rounded-xl px-4 py-3.5 text-left
					font-normal shadow-none
					before:rounded-xl before:shadow-none
				`,
				'hover:text-foreground',
			)}
			onMouseEnter={onRowEnter}
			onMouseLeave={onRowLeave}
			render={<a href={href} rel="noreferrer" target="_blank" />}
			variant="outline"
		>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			<ArrowUpRightIcon
				className="-mx-0.5 text-muted-foreground opacity-80"
				ref={arrowRef}
				size={16}
			/>
		</Button>
	)
}
