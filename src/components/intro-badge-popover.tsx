'use client'

import type { IconProps } from 'nucleo-ui-essential-fill-duo-18'
import type { FC, KeyboardEvent, ReactNode } from 'react'

import type { IntroBadgeKind } from '@/lib/i18n/intro-badges'

import {
	IconGraduationCapFillDuo18,
	IconSuitcase3FillDuo18,
} from 'nucleo-ui-essential-fill-duo-18'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

const ICONS: Record<IntroBadgeKind, FC<IconProps>> = {
	products: IconSuitcase3FillDuo18,
	systems: IconGraduationCapFillDuo18,
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function readSupportsHover() {
	return typeof window !== 'undefined' && window.matchMedia(HOVER_QUERY).matches
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
	const descriptionId = useId()
	const [open, setOpen] = useState(false)
	const [supportsHover, setSupportsHover] = useState(readSupportsHover)
	const closeTimeoutRef = useRef<number | undefined>(undefined)

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

	const toggleOnPress = () => {
		if (supportsHover) {
			return
		}

		setOpen(value => !value)
	}

	const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
		if (event.key === 'Escape') {
			setOpen(false)
			return
		}

		if (event.key !== 'Enter' && event.key !== ' ') {
			return
		}

		event.preventDefault()
		setOpen(value => !value)
	}

	useEffect(() => {
		const query = window.matchMedia(HOVER_QUERY)
		const syncHover = () => setSupportsHover(query.matches)

		query.addEventListener('change', syncHover)

		return () => {
			query.removeEventListener('change', syncHover)
			if (closeTimeoutRef.current) {
				window.clearTimeout(closeTimeoutRef.current)
			}
		}
	}, [])

	return (
		<span
			className="relative inline-flex"
			onMouseEnter={openOnHover}
			onMouseLeave={closeOnHoverEnd}
		>
			{/* <button> is atomic in inline layout; span + role="button" fragments like inline code. */}
			<span
				className={cn(
					`
						mx-0.5 inline-flex translate-y-[0.08em] cursor-pointer items-center gap-[0.25em] rounded-md highlight-surface border highlight-surface-hover
						bg-popover px-[0.35em] py-[0.16em] align-baseline text-sm leading-[1.1] font-semibold whitespace-nowrap text-highlight-strong transition-colors
						hover:bg-accent/50
						focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none
						dark:bg-input/32
						dark:hover:bg-input/64
						[&_svg]:block [&_svg]:size-[1em] [&_svg]:shrink-0 [&_svg]:translate-y-[-0.04em] [&_svg]:text-highlight-icon
					`,
					open && 'highlight-surface-active',
				)}
				aria-describedby={open ? descriptionId : undefined}
				aria-expanded={open}
				onClick={toggleOnPress}
				onKeyDown={onKeyDown}
				role="button"
				tabIndex={0}
			>
				<Icon aria-hidden />
				<span className="leading-none">{label}</span>
			</span>
			{open && (
				<span
					className="
						absolute top-full left-0 z-50 mt-2 block w-max max-w-72 rounded-lg border
						bg-popover px-4 py-3 text-sm/6 text-muted-foreground shadow-lg/5
						not-dark:bg-clip-padding
					"
					id={descriptionId}
					role="tooltip"
				>
					{description}
				</span>
			)}
		</span>
	)
}
