import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Link } from 'waku'

import { cn } from '@/lib/cn'

export function Container({
	children,
	className,
	...props
}: { children: ReactNode } & ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			className={cn(`
				mx-auto w-full max-w-2xl px-4
				sm:px-6
			`, className)}
			{...props}
		>
			{children}
		</div>
	)
}

export function Eyebrow({
	children,
	className,
	...props
}: { children: ReactNode } & ComponentPropsWithoutRef<'p'>) {
	return (
		<p
			className={cn(
				`font-ui text-base font-medium text-foreground`,
				className,
			)}
			{...props}
		>
			{children}
		</p>
	)
}

export function TextLink({
	children,
	className,
	to,
	...props
}: ComponentPropsWithoutRef<typeof Link>) {
	return (
		<Link
			className={cn(
				`
					inline-flex items-center gap-2 font-ui text-sm text-foreground underline decoration-border underline-offset-4 transition-colors
					duration-150
					hover:text-black hover:decoration-current
				`,
				className,
			)}
			to={to}
			{...props}
		>
			{children}
		</Link>
	)
}
