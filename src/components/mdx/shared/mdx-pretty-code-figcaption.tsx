'use client'

import type * as React from 'react'

import { useRef } from 'react'

import { CopyButton } from '@/components/mdx/shared/copy-button'
import { cn } from '@/lib/cn'

type FigcaptionProps = React.ComponentProps<'figcaption'>

export function MdxPrettyCodeFigcaption({
	children,
	className,
	icon,
	...props
}: FigcaptionProps & {
	icon: React.ReactNode
}) {
	const capRef = useRef<HTMLElement>(null)

	return (
		<figcaption
			{...props}
			className={cn(
				`
					flex items-center justify-between gap-3 pr-2 text-[.8125rem] text-white/75
					[&_svg]:size-4.5 [&_svg]:text-white/55
					sm:[&_svg]:size-4
				`,
				className,
			)}
			ref={capRef}
		>
			<span className="flex min-w-0 items-center gap-2">
				{icon}
				{children}
			</span>
			<CopyButton
				getValue={() =>
					capRef.current?.closest('figure')?.querySelector('pre code')?.textContent ?? ''}
				placement="toolbar"
				value=""
				codeSurface
			/>
		</figcaption>
	)
}
