'use client'

import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTrigger,
} from '@/components/ui/popover'

const INTRO_BADGES = {
	products: {
		description: (
			<>
				Today I work at
				{' '}
				<a
					className="text-link text-link-strong"
					href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
					rel="noreferrer"
					target="_blank"
				>
					Central China Normal University
				</a>
				{' '}
				on production AI products and intelligent experiences—exploring how models
				reshape interfaces, collaboration, and tools.
			</>
		),
		Icon: BriefcaseBusiness,
		label: 'intelligent products',
	},
	systems: {
		description: (
			<>
				My background is in
				{' '}
				<i>Intelligent Transportation Systems</i>
				: software and design where physical infrastructure meets digital systems.
			</>
		),
		Icon: GraduationCap,
		label: 'systems background',
	},
} satisfies Record<string, {
	description: ReactNode
	Icon: LucideIcon
	label: string
}>

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

export function IntroBadgePopover({ kind }: { kind: keyof typeof INTRO_BADGES }) {
	const { description, Icon, label } = INTRO_BADGES[kind]
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
							-mx-0.5 inline cursor-pointer rounded-md border border-input bg-popover px-[0.35em] py-0 align-baseline
							text-sm leading-[inherit] font-semibold text-inherit shadow-xs/5 transition-colors
							hover:bg-accent/50
							focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none
							dark:bg-input/32
							dark:hover:bg-input/64
							[&_svg]:mr-[0.25em] [&_svg]:inline [&_svg]:size-[1em] [&_svg]:align-[-0.125em] [&_svg]:opacity-80
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
