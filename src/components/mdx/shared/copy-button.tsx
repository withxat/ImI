'use client'

import type * as React from 'react'

import { CheckIcon, CopyIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/components/mdx/hooks/use-copy-to-clipboard'
import { Button } from '@/components/mdx/ui/button'
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from '@/components/mdx/ui/tooltip'
import { cn } from '@/lib/cn'

export function CopyButton({
	className,
	value,
	variant = 'ghost',
	...props
}: {
	src?: string
	value: string
} & React.ComponentProps<typeof Button>) {
	const { copyToClipboard, isCopied } = useCopyToClipboard()

	return (
		<Tooltip>
			<TooltipTrigger
				render={(
					<Button
						className={cn(
							`
								absolute top-1.5 right-1.5 z-3 size-9 bg-code opacity-70
								hover:opacity-100
								focus-visible:opacity-100
								sm:size-8
							`,
							className,
						)}
						data-slot="copy-button"
						onClick={() => copyToClipboard(value)}
						size="icon"
						variant={variant}
						{...props}
					>
						<span className="sr-only">Copy</span>
						{isCopied
							? <CheckIcon strokeWidth={2} />
							: <CopyIcon strokeWidth={2} />}
					</Button>
				)}
			/>
			<TooltipPopup>{isCopied ? 'Copied' : 'Copy to Clipboard'}</TooltipPopup>
		</Tooltip>
	)
}
