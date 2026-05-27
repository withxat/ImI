'use client'

import type { IconProps } from 'nucleo-ui-essential-fill-duo-18'
import type { ComponentProps, FC, ReactNode } from 'react'

import type { IntroBadgeKind } from '@/lib/i18n/intro-badges'

import {
	IconGraduationCapFillDuo18,
	IconSuitcase3FillDuo18,
} from 'nucleo-ui-essential-fill-duo-18'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/cn'

const ICONS: Record<IntroBadgeKind, FC<IconProps>> = {
	products: IconSuitcase3FillDuo18,
	systems: IconGraduationCapFillDuo18,
}

type PopoverOpenChangeDetails = Parameters<NonNullable<ComponentProps<typeof Popover>['onOpenChange']>>[1]

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeToHoverCapability(onStoreChange: () => void) {
	const query = window.matchMedia(HOVER_QUERY)

	query.addEventListener('change', onStoreChange)

	return () => query.removeEventListener('change', onStoreChange)
}

function getHoverCapabilitySnapshot() {
	return window.matchMedia(HOVER_QUERY).matches
}

export function IntroBadgePopover({
	description,
	kind,
	label,
}: {
	description: ReactNode
	kind: IntroBadgeKind
	label: string
}) {
	const Icon = ICONS[kind]
	const [open, setOpen] = useState(false)
	const closeTimeoutRef = useRef<number | undefined>(undefined)
	const supportsHover = useSyncExternalStore(
		subscribeToHoverCapability,
		getHoverCapabilitySnapshot,
		() => false,
	)

	const clearCloseTimeout = () => {
		if (closeTimeoutRef.current) {
			window.clearTimeout(closeTimeoutRef.current)
		}
	}

	const openOnHover = () => {
		if (!supportsHover) {
			return
		}

		clearCloseTimeout()
		setOpen(true)
	}

	const closeOnHoverEnd = () => {
		if (!supportsHover) {
			return
		}

		clearCloseTimeout()
		closeTimeoutRef.current = window.setTimeout(setOpen, 80, false)
	}

	const handleOpenChange = (nextOpen: boolean, details: PopoverOpenChangeDetails) => {
		if (
			supportsHover
			&& details.reason === 'trigger-press'
			&& !(details.event instanceof KeyboardEvent)
		) {
			return
		}

		setOpen(nextOpen)
	}

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) {
				window.clearTimeout(closeTimeoutRef.current)
			}
		}
	}, [])

	return (
		<Popover onOpenChange={handleOpenChange} open={open}>
			{/* <button> is atomic in inline layout; span + role="button" fragments like inline code. */}
			<PopoverTrigger
				render={(
					<span
						className={cn(
							`
								mx-0.5 inline-flex translate-y-[0.08em] cursor-pointer items-center gap-[0.25em] rounded-md highlight-surface border highlight-surface-hover
								bg-popover px-[0.35em] py-[0.12em] align-baseline text-sm leading-[1.1] font-semibold whitespace-nowrap text-highlight-strong transition-colors
								hover:bg-accent/50
								focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none
								dark:bg-input/32
								dark:hover:bg-input/64
								[&_svg]:block [&_svg]:size-[1em] [&_svg]:shrink-0 [&_svg]:translate-y-[-0.08em] [&_svg]:text-highlight-icon
							`,
							open && 'highlight-surface-active',
						)}
						onMouseEnter={openOnHover}
						onMouseLeave={closeOnHoverEnd}
					/>
				)}
				nativeButton={false}
			>
				<Icon aria-hidden />
				<span className="leading-none">{label}</span>
			</PopoverTrigger>
			<PopoverPopup
				align="start"
				className="max-w-72"
				onMouseEnter={openOnHover}
				onMouseLeave={closeOnHoverEnd}
				sideOffset={8}
			>
				<PopoverDescription className="text-sm/6">
					{description}
				</PopoverDescription>
			</PopoverPopup>
		</Popover>
	)
}
