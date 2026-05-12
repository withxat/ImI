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
			<PopoverTrigger
				render={(
					<button
						className="
							mx-0.5 inline cursor-pointer rounded-md border border-highlight/75 bg-popover px-[0.35em] py-0 align-baseline
							text-sm leading-[inherit] font-semibold text-highlight-strong shadow-xs shadow-highlight/30 transition-colors
							hover:border-highlight hover:bg-accent/50 hover:shadow-highlight/45
							focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none
							dark:bg-input/32
							dark:hover:bg-input/64
							[&_svg]:mr-[0.25em] [&_svg]:inline [&_svg]:size-[1em] [&_svg]:align-[-0.125em] [&_svg]:text-highlight [&_svg]:opacity-75
							hover:[&_svg]:opacity-100
						"
						onMouseEnter={openOnHover}
						onMouseLeave={closeOnHoverEnd}
						type="button"
					/>
				)}
			>
				<Icon aria-hidden />
				{label}
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
