'use client'

import { CheckIcon, CopyIcon, TerminalIcon } from 'lucide-react'
import * as React from 'react'

import { useConfig } from '@/components/mdx/hooks/use-config'
import { useCopyToClipboard } from '@/components/mdx/hooks/use-copy-to-clipboard'
import { Button } from '@/components/mdx/ui/button'
import { ScrollArea } from '@/components/mdx/ui/scroll-area'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/mdx/ui/tabs'
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from '@/components/mdx/ui/tooltip'

export function CodeBlockCommand({
	__bun__,
	__npm__,
	__pnpm__,
	__yarn__,
}: React.ComponentProps<'pre'> & {
	__bun__?: string
	__npm__?: string
	__pnpm__?: string
	__yarn__?: string
}) {
	const [config, setConfig] = useConfig()
	const { copyToClipboard, isCopied } = useCopyToClipboard()

	const packageManager = config.packageManager || 'pnpm'
	const tabs = React.useMemo(() => {
		return {
			bun: __bun__,
			npm: __npm__,
			pnpm: __pnpm__,
			yarn: __yarn__,
		}
	}, [__npm__, __pnpm__, __yarn__, __bun__])

	const copyCommand = React.useCallback(() => {
		const command = tabs[packageManager]

		if (!command) {
			return
		}

		copyToClipboard(command)
	}, [packageManager, tabs, copyToClipboard])

	return (
		<div>
			<Tabs
				onValueChange={(value) => {
					setConfig({
						...config,
						packageManager: value as 'bun' | 'npm' | 'pnpm' | 'yarn',
					})
				}}
				className="gap-0"
				value={packageManager}
			>
				<div className="flex items-center gap-2 border-b border-border/64 px-4 py-1 font-mono">
					<TerminalIcon
						className="
							size-5 text-code-foreground
							sm:size-4
						"
						strokeWidth={2}
					/>
					<TabsList className="
						bg-transparent p-0
						*:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none
					"
					>
						{Object.entries(tabs).map(([key]) => {
							return (
								<TabsTab className="rounded-lg" key={key} value={key}>
									{key}
								</TabsTab>
							)
						})}
					</TabsList>
				</div>
				<ScrollArea className="
					**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2
					**:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2
				"
				>
					{Object.entries(tabs).map(([key, value]) => {
						return (
							<TabsPanel
								className="mt-0 w-max px-4 py-3.5"
								key={key}
								value={key}
							>
								<pre>
									<code
										className="relative font-mono text-[.8125rem] leading-none"
										data-language="bash"
									>
										{value}
									</code>
								</pre>
							</TabsPanel>
						)
					})}
				</ScrollArea>
			</Tabs>
			<Tooltip>
				<TooltipTrigger
					render={(
						<Button
							className="
								absolute top-1.5 right-1.5 z-3 size-9 opacity-70
								hover:opacity-100
								focus-visible:opacity-100
								sm:size-8
							"
							data-slot="copy-button"
							onClick={copyCommand}
							size="icon"
							variant="ghost"
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
		</div>
	)
}
