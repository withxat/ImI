'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { BriefcaseBusiness, GraduationCap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTitle,
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
		title: 'Intelligent products',
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
		title: 'Systems background',
	},
} satisfies Record<string, {
	description: ReactNode
	Icon: LucideIcon
	label: string
	title: string
}>

export function IntroBadgePopover({ kind }: { kind: keyof typeof INTRO_BADGES }) {
	const { description, Icon, label, title } = INTRO_BADGES[kind]

	return (
		<Popover>
			<PopoverTrigger
				render={(
					<Button
						className="-mx-0.5 align-[0.08em]"
						size="xs"
						variant="outline"
					/>
				)}
			>
				<Icon aria-hidden />
				{label}
			</PopoverTrigger>
			<PopoverPopup align="start" className="max-w-72" sideOffset={8}>
				<div className="space-y-2">
					<PopoverTitle className="text-sm">{title}</PopoverTitle>
					<PopoverDescription className="text-sm/6">
						{description}
					</PopoverDescription>
				</div>
			</PopoverPopup>
		</Popover>
	)
}
