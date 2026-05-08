import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Link } from 'waku'

import { cn } from '../../lib/cn'

export function Container({
	children,
	className,
	...props
}: { children: ReactNode } & ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			className={cn(`
				mx-auto w-full max-w-6xl px-4
				sm:px-6
				lg:px-8
			`, className)}
			{...props}
		>
			{children}
		</div>
	)
}

export function SurfacePanel({
	children,
	className,
	...props
}: { children: ReactNode } & ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			className={cn(
				`rounded-lg border bg-surface text-(--color-surface-foreground) shadow-(--shadow-soft)`,
				className,
			)}
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
				`text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase`,
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
					inline-flex items-center gap-2 text-sm font-medium text-(--color-foreground) underline decoration-border underline-offset-4 transition-colors
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
