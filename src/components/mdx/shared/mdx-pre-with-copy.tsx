'use client'

import type * as React from 'react'

import { useRef } from 'react'

import { CopyButton } from '@/components/mdx/shared/copy-button'
import { ScrollArea } from '@/components/mdx/ui/scroll-area'
import { cn } from '@/lib/cn'

type PreProps = React.ComponentProps<'pre'>

export function MdxPreWithCopy({ children, className, ...props }: PreProps) {
	const rootRef = useRef<HTMLDivElement>(null)

	return (
		<div className="relative" ref={rootRef}>
			<div
				className="pointer-events-none absolute inset-e-0 top-0 z-30 pe-2 pt-2"
				data-mdx-pre-copy-slot=""
			>
				<div className="pointer-events-auto">
					<CopyButton
						getValue={() =>
							rootRef.current?.querySelector('pre code')?.textContent ?? ''}
						placement="toolbar"
						value=""
						codeSurface
					/>
				</div>
			</div>
			<ScrollArea className="
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2
			"
			>
				<pre
					className={cn(
						`
							w-max min-w-full px-4 py-3.5 text-[.8125rem] outline-none
							has-data-highlighted-line:px-0
							has-data-line-numbers:px-0
							has-data-[slot=tabs]:p-0
						`,
						className,
					)}
					{...props}
				>
					{children}
				</pre>
			</ScrollArea>
		</div>
	)
}
