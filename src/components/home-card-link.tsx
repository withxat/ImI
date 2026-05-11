import type { ComponentProps } from 'react'

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
}

function HomeCardLinkContent({
	description,
	external,
	hasHref,
	title,
}: {
	description: string
	external?: boolean
	hasHref: boolean
	title: string
}) {
	const Icon = external ? ArrowUpRightIcon : ArrowRightIcon

	return (
		<>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			{hasHref && (
				<Icon
					className={cn(
						`
							-mx-0.5 size-4 shrink-0 text-muted-foreground opacity-80 transition-transform duration-150 ease-out
							group-hover:text-foreground
						`,
						external
							? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
							: 'group-hover:translate-x-0.5',
					)}
					aria-hidden="true"
				/>
			)}
		</>
	)
}

export function HomeCardLink({
	description,
	external = false,
	href,
	prefetchOnView = false,
	title,
}: HomeCardLinkProps) {
	const className = `
		group flex items-center justify-start gap-3 rounded-xl border border-input bg-popover px-4
		py-3.5 text-left font-normal shadow-xs/5 transition-colors
		not-dark:bg-clip-padding
		hover:bg-accent/50 hover:text-foreground
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
				hasHref
			/>
		</Link>
	)
}
