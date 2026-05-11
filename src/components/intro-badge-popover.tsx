'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { BriefcaseBusiness, GraduationCap } from 'lucide-react'

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

export function IntroBadgePopover({ kind }: { kind: keyof typeof INTRO_BADGES }) {
	const { description, Icon, label } = INTRO_BADGES[kind]

	return (
		<Popover>
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
						type="button"
					/>
				)}
			>
				<Icon aria-hidden />
				{label}
			</PopoverTrigger>
			<PopoverPopup align="start" className="max-w-72" sideOffset={8}>
				<PopoverDescription className="text-sm/6">
					{description}
				</PopoverDescription>
			</PopoverPopup>
		</Popover>
	)
}
