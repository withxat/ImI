'use client'

import type { FC, ReactNode, SVGProps } from 'react'

import type { IntroBadgeKind } from '@/lib/i18n/intro-badges'

import GraduationCapIcon from '@/assets/icons/graduation-cap.svg?react'
import SuitcaseIcon from '@/assets/icons/suitcase.svg?react'
import { Popover, PopoverPopup, PopoverTrigger } from '@/components/ui/popover'

const ICONS: Record<IntroBadgeKind, FC<SVGProps<SVGSVGElement>>> = {
	products: SuitcaseIcon,
	systems: GraduationCapIcon,
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

	return (
		<Popover>
			{/* <button> is atomic in inline layout; span + role="button" fragments like inline code. */}
			<PopoverTrigger
				className="
					mx-0.5 inline-flex translate-y-[0.08em] cursor-pointer items-center gap-[0.25em] rounded-md highlight-surface border highlight-surface-hover
					bg-popover px-[0.35em] py-[0.16em] align-baseline text-sm leading-[1.1] font-semibold whitespace-nowrap text-highlight-strong transition-colors
					hover:bg-accent/50
					focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none
					data-popup-open:highlight-surface-active
					dark:bg-input/32
					dark:hover:bg-input/64
					[&_svg]:block [&_svg]:size-[1em] [&_svg]:shrink-0 [&_svg]:translate-y-[-0.04em] [&_svg]:text-highlight-icon
				"
				closeDelay={80}
				delay={120}
				nativeButton={false}
				render={<span />}
				openOnHover
			>
				<Icon aria-hidden />
				<span className="leading-none">{label}</span>
			</PopoverTrigger>
			<PopoverPopup
				align="start"
				alignOffset={-4}
				className="max-w-72 text-sm/6 text-muted-foreground"
				side="bottom"
				sideOffset={8}
			>
				{description}
			</PopoverPopup>
		</Popover>
	)
}
