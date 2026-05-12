import type { ComponentProps, ReactNode } from 'react'

import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import { Link } from 'waku'

import { cn } from '@/lib/cn'

type InternalHref = ComponentProps<typeof Link>['to']

interface HomeCardLinkProps {
	description: string
	external?: boolean
	href?: InternalHref | string
	prefetchOnView?: boolean
	title: string
	trailingIcon?: ReactNode
}

function HomeCardLinkContent({
	description,
	external,
	hasHref,
	title,
	trailingIcon,
}: {
	description: string
	external?: boolean
	hasHref: boolean
	title: string
	trailingIcon?: ReactNode
}) {
	const Icon = external ? ArrowUpRightIcon : ArrowRightIcon
	const defaultIcon = hasHref
		? (
				<Icon
					className={cn(
						`
							-mx-0.5 size-4 shrink-0 text-muted-foreground opacity-80 transition-transform duration-150 ease-out
							group-hover:text-highlight-icon
						`,
						external
							? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
							: 'group-hover:translate-x-0.5',
					)}
					aria-hidden="true"
				/>
			)
		: null

	return (
		<>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			{trailingIcon ?? defaultIcon}
		</>
	)
}

export function HomeCardLink({
	description,
	external = false,
	href,
	prefetchOnView = false,
	title,
	trailingIcon,
}: HomeCardLinkProps) {
	const className = `
		group flex items-center justify-start gap-3 rounded-xl border border-highlight/75 bg-popover px-4
		py-3.5 text-left font-normal shadow-xs shadow-highlight/30 transition-colors
		not-dark:bg-clip-padding
		hover:border-highlight hover:bg-accent/50 hover:text-foreground hover:shadow-highlight/45
		dark:bg-input/32
		dark:hover:bg-input/64
	`

	if (!href) {
		return (
			<div className={className}>
				<HomeCardLinkContent
					description={description}
					external={external}
					hasHref={false}
					title={title}
					trailingIcon={trailingIcon}
				/>
			</div>
		)
	}

	if (external) {
		return (
			<a
				className={className}
				href={href}
				rel="noreferrer"
				target="_blank"
			>
				<HomeCardLinkContent
					description={description}
					title={title}
					trailingIcon={trailingIcon}
					external
					hasHref
				/>
			</a>
		)
	}

	return (
		<Link
			className={className}
			to={href as InternalHref}
			unstable_prefetchOnView={prefetchOnView}
		>
			<HomeCardLinkContent
				description={description}
				external={external}
				title={title}
				trailingIcon={trailingIcon}
				hasHref
			/>
		</Link>
	)
}
