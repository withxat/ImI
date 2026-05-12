'use client'

import type * as React from 'react'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

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
	codeSurface = false,
	getValue,
	placement = 'floating',
	value = '',
	variant = 'ghost',
	...props
}: React.ComponentProps<typeof Button> & {
	/** Dark code panel chrome: fixed light icon/surface; ignores page light/dark semantic tokens. */
	codeSurface?: boolean
	getValue?: () => string
	/** `floating`: absolute corner over a code panel. `toolbar`: inline in a figcaption row. */
	placement?: 'floating' | 'toolbar'
	src?: string
	value?: string
}) {
	const { copyToClipboard, isCopied } = useCopyToClipboard()
	const reduceMotion = useReducedMotion()

	const iconMotion = reduceMotion
		? {
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				initial: { opacity: 0 },
				transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] as const },
			}
		: {
				animate: { filter: 'blur(0px)', opacity: 1, scale: 1 },
				exit: { filter: 'blur(2px)', opacity: 0, scale: 0.92 },
				initial: { filter: 'blur(2px)', opacity: 0, scale: 0.92 },
				transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] as const },
			}

	const codeChromeBtn = codeSurface
		? `
				!border-white/12 !bg-white/[0.06] !text-white/85 shadow-none
				backdrop-blur-[2px] transition-[transform,background-color,color,opacity]
				duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
				hover:!bg-white/11 hover:!text-white
				focus-visible:!text-white
				focus-visible:ring-1 focus-visible:ring-white/28 focus-visible:ring-offset-0
				active:scale-[0.97]
				motion-reduce:active:scale-100
				*:data-[slot=button-loading-indicator]:!text-white/85
				[&_svg:not([class*='size-'])]:!text-inherit
			`
		: ''

	const placementClasses
		= placement === 'floating'
			? codeSurface
				? `
						absolute! inset-e-2 top-2 z-20
						sm:inset-e-1.5 sm:top-1.5
					`
				: `
						absolute! inset-e-3 top-3 z-20 size-9 bg-code/90 opacity-80 shadow-sm
						hover:opacity-100
						focus-visible:opacity-100
						sm:inset-e-2.5 sm:top-2.5 sm:size-8
					`
			: codeSurface
				? `relative`
				: `
						relative size-8 shrink-0 rounded-md text-code-foreground opacity-75
						hover:bg-white/10 hover:opacity-100
						focus-visible:opacity-100
					`

	return (
		<Tooltip>
			<TooltipTrigger
				render={(
					<Button
						className={cn(codeChromeBtn, placementClasses, className)}
						data-slot="copy-button"
						onClick={() => copyToClipboard(getValue ? getValue() : value)}
						size={codeSurface ? 'icon-xs' : 'icon'}
						variant={codeSurface ? 'ghost' : variant}
						{...props}
					>
						<span className="sr-only">Copy</span>
						<span
							className="pointer-events-none absolute inset-0 flex transform-[translateZ(0)] items-center justify-center"
							data-slot="copy-button-icon-host"
						>
							<AnimatePresence initial={false} mode="sync">
								<motion.span
									animate={iconMotion.animate}
									className="absolute inset-0 flex items-center justify-center"
									exit={iconMotion.exit}
									initial={iconMotion.initial}
									key={isCopied ? 'check' : 'copy'}
									transition={iconMotion.transition}
								>
									{isCopied
										? (
												<CheckIcon
													className={cn(
														codeSurface && 'text-emerald-300!',
														codeSurface
															? `
																size-3
																sm:size-2.5
															`
															: `
																size-3.5
																sm:size-3
															`,
													)}
													strokeWidth={2}
												/>
											)
										: (
												<CopyIcon
													className={cn(
														codeSurface && 'text-white/80!',
														codeSurface
															? `
																size-3
																sm:size-2.5
															`
															: `
																size-3.5
																sm:size-3
															`,
													)}
													strokeWidth={2}
												/>
											)}
								</motion.span>
							</AnimatePresence>
						</span>
					</Button>
				)}
			/>
			<TooltipPopup>{isCopied ? 'Copied' : 'Copy to Clipboard'}</TooltipPopup>
		</Tooltip>
	)
}
