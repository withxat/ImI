'use client'

import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'

import { buttonVariants } from '@/components/ui/button-variants'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'

export interface ButtonProps extends useRender.ComponentProps<'button'> {
	loading?: boolean
	size?: VariantProps<typeof buttonVariants>['size']
	variant?: VariantProps<typeof buttonVariants>['variant']
}

export function Button({
	children,
	className,
	disabled: disabledProp,
	loading = false,
	render,
	size,
	variant,
	...props
}: ButtonProps): React.ReactElement {
	const isDisabled: boolean = Boolean(loading || disabledProp)
	const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
		= render ? undefined : 'button'

	const defaultProps = {
		'aria-disabled': loading || undefined,
		'children': (
			<>
				{children}
				{loading && (
					<Spinner
						className="pointer-events-none absolute"
						data-slot="button-loading-indicator"
					/>
				)}
			</>
		),
		'className': cn(buttonVariants({ className, size, variant })),
		'data-loading': loading ? '' : undefined,
		'data-slot': 'button',
		'disabled': isDisabled,
		'type': typeValue,
	}

	return useRender({
		defaultTagName: 'button',
		props: mergeProps<'button'>(defaultProps, props),
		render,
	})
}

export { buttonVariants } from '@/components/ui/button-variants'
