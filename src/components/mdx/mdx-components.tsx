import type * as React from 'react'

import { InfoIcon } from 'lucide-react'

import { CodeBlockCommand } from '@/components/mdx/code-block-command'
import { CodeCollapsibleWrapper } from '@/components/mdx/code-collapsible-wrapper'
import { CodeTabs } from '@/components/mdx/code-tabs'
import { ComponentPreview } from '@/components/mdx/component-preview'
import { ComponentSource } from '@/components/mdx/component-source'
import { MediaQueryDemo } from '@/components/mdx/media-query-demo'
import { CopyButton } from '@/components/mdx/shared/copy-button'
import { getIconForLanguageExtension } from '@/components/mdx/shared/icons'
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from '@/components/mdx/ui/accordion'
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from '@/components/mdx/ui/alert'
import { Button } from '@/components/mdx/ui/button'
import { ScrollArea } from '@/components/mdx/ui/scroll-area'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/mdx/ui/tabs'
import { cn } from '@/lib/cn'

function slugifyHeading(children: React.ReactNode) {
	return children
		?.toString()
		.replace(/ /g, '-')
		.replace(/'/g, '')
		.replace(/\?/g, '')
		.toLowerCase()
}

type MdxLinkProps = React.ComponentProps<'a'> & {
	href?: string
	to?: string
}

function MdxLink({ className, href, to, ...props }: MdxLinkProps) {
	return (
		<a
			className={cn('text-link font-medium', className)}
			href={href ?? to}
			{...props}
		/>
	)
}

export const mdxComponents = {
	a: ({ className, ...props }: React.ComponentProps<'a'>) => (
		<a
			className={cn(
				'text-link font-medium text-highlight-strong',
				className,
			)}
			{...props}
		/>
	),
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
	Alert: ({ className, ...props }: React.ComponentProps<typeof Alert>) => (
		<Alert className={cn('my-6', className)} {...props} />
	),
	AlertAction,
	AlertDescription,
	AlertTitle,
	blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
		<blockquote
			className={cn('mt-6 border-l-2 ps-6 italic', className)}
			{...props}
		/>
	),
	Button,
	code: ({
		__bun__,
		__npm__,
		__pnpm__,
		__raw__,
		__src__,
		__yarn__,
		className,
		...props
	}: React.ComponentProps<'code'> & {
		__bun__?: string
		__npm__?: string
		__pnpm__?: string
		__raw__?: string
		__src__?: string
		__yarn__?: string
	}) => {
		// Inline Code.
		if (typeof props.children === 'string') {
			return (
				<code
					className={cn(
						'relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem] text-muted-foreground outline-none',
						className,
					)}
					{...props}
				/>
			)
		}

		// npm command.
		const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__
		if (isNpmCommand) {
			return (
				<CodeBlockCommand
					__bun__={__bun__}
					__npm__={__npm__}
					__pnpm__={__pnpm__}
					__yarn__={__yarn__}
				/>
			)
		}

		// Default codeblock.
		return (
			<>
				{__raw__ && <CopyButton src={__src__} value={__raw__} />}
				<code {...props} />
			</>
		)
	},
	CodeCollapsibleWrapper,
	CodeTabs,
	ComponentPreview,
	ComponentSource,
	figcaption: ({
		children,
		className,
		...props
	}: React.ComponentProps<'figcaption'>) => {
		const iconExtension
			= 'data-language' in props && typeof props['data-language'] === 'string'
				? getIconForLanguageExtension(props['data-language'])
				: null

		return (
			<figcaption
				className={cn(
					`
						flex items-center gap-2 text-[.8125rem] text-code-foreground
						[&_svg]:size-4.5 [&_svg]:text-code-foreground [&_svg]:opacity-70
						sm:[&_svg]:size-4
					`,
					className,
				)}
				{...props}
			>
				{iconExtension}
				{children}
			</figcaption>
		)
	},
	figure: ({ className, ...props }: React.ComponentProps<'figure'>) => {
		return <figure className={cn(className)} {...props} />
	},
	h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
		<h1
			className={cn(
				'mt-2 scroll-m-20 font-heading text-3xl font-semibold',
				className,
			)}
			{...props}
		/>
	),
	h2: ({ children, className, ...props }: React.ComponentProps<'h2'>) => {
		const id = (props as { id?: string }).id || slugifyHeading(children)

		return (
			<h2
				{...props}
				className={cn(
					`
						mt-12 scroll-m-20 font-heading text-2xl font-semibold
						first:mt-0
						lg:mt-16
						[&+p]:mt-4!
						*:[code]:text-2xl
					`,
					className,
				)}
				id={id}
			>
				<a
					className="
						no-underline underline-offset-4
						hover:underline
					"
					href={`#${id}`}
				>
					{children}
				</a>
			</h2>
		)
	},
	h3: ({ children, className, ...props }: React.ComponentProps<'h3'>) => {
		const id = (props as { id?: string }).id || slugifyHeading(children)

		return (
			<h3
				{...props}
				className={cn(
					`
						mt-8 scroll-m-20 text-lg font-semibold
						*:[code]:text-lg
					`,
					className,
				)}
				id={id}
			>
				<a
					className="
						no-underline underline-offset-4
						hover:underline
					"
					href={`#${id}`}
				>
					{children}
				</a>
			</h3>
		)
	},
	h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
		<h4
			className={cn('mt-8 scroll-m-20 font-medium tracking-tight', className)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
		<h5
			className={cn(
				'mt-8 scroll-m-20 text-lg font-medium tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
		<h6
			className={cn(
				'mt-8 scroll-m-20 text-base font-medium tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	hr: ({ ...props }: React.ComponentProps<'hr'>) => (
		<hr
			className="
				my-4
				md:my-8
			"
			{...props}
		/>
	),
	Image: ({
		alt,
		className,
		height,
		src,
		width,
		...props
	}: React.ComponentProps<'img'>) => (
		<img
			alt={alt || ''}
			className={cn('mt-6 rounded-md border', className)}
			height={height}
			src={typeof src === 'string' ? src : ''}
			width={width}
			{...props}
		/>
	),
	img: ({ alt, className, ...props }: React.ComponentProps<'img'>) => (
		<img alt={alt} className={cn('rounded-md', className)} {...props} />
	),
	InfoIcon,
	li: ({ className, ...props }: React.ComponentProps<'li'>) => (
		<li className={cn('mt-2', className)} {...props} />
	),
	Link: MdxLink,
	MediaQueryDemo,
	ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
		<ol
			className={cn('my-6 ms-4 list-decimal text-muted-foreground', className)}
			{...props}
		/>
	),
	p: ({ className, ...props }: React.ComponentProps<'p'>) => (
		<p
			className={cn(
				`
					leading-relaxed text-muted-foreground
					not-first:mt-6
				`,
				className,
			)}
			{...props}
		/>
	),
	pre: ({ children, className, ...props }: React.ComponentProps<'pre'>) => {
		return (
			<ScrollArea className="
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2
			"
			>
				<pre
					className={cn(
						`
							w-max min-w-full px-4 py-3.5 text-[.8125rem] outline-none
							has-data-highlighted-line:px-0
							has-data-line-numbers:px-0
							has-data-[slot=tabs]:p-0
						`,
						className,
					)}
					{...props}
				>
					{children}
				</pre>
			</ScrollArea>
		)
	},
	Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
		<h3
			className={cn('mt-8 scroll-m-32 font-medium tracking-tight', className)}
			{...props}
		/>
	),
	Steps: ({ ...props }: React.ComponentProps<'div'>) => (
		<div
			className="
				mb-12 [counter-reset:step]
				*:[h3]:first:mt-0!
			"
			{...props}
		/>
	),
	strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<strong
			className={cn('font-medium text-highlight-strong', className)}
			{...props}
		/>
	),
	Tab: ({ className, ...props }: React.ComponentProps<'div'>) => (
		<div className={cn(className)} {...props} />
	),
	table: ({ className, ...props }: React.ComponentProps<'table'>) => (
		<ScrollArea className="my-6" scrollbarGutter>
			<table
				className={cn('relative w-full border-none text-sm', className)}
				{...props}
			/>
		</ScrollArea>
	),
	Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => {
		return <Tabs className={cn(className)} {...props} />
	},
	TabsList: ({
		className,
		...props
	}: React.ComponentProps<typeof TabsList>) => (
		<TabsList
			className={cn(
				`
					bg-transparent p-0
					*:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none
				`,
				className,
			)}
			{...props}
		/>
	),
	TabsPanel: ({
		className,
		...props
	}: React.ComponentProps<typeof TabsPanel>) => (
		<TabsPanel
			className={cn(
				`
					relative
					[&_h3]:text-base [&_h3]:font-medium
					*:[figure]:first:mt-0
					[&>.steps]:mt-6
				`,
				className,
			)}
			{...props}
		/>
	),
	TabsTab: ({ className, ...props }: React.ComponentProps<typeof TabsTab>) => (
		<TabsTab className={cn('rounded-lg', className)} {...props} />
	),
	td: ({ className, ...props }: React.ComponentProps<'td'>) => (
		<td
			className={cn(
				`
					px-4 py-2 text-left whitespace-nowrap
					[[align=center]]:text-center
					[[align=right]]:text-right
				`,
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }: React.ComponentProps<'th'>) => (
		<th
			className={cn(
				`
					px-4 py-2 text-left font-medium
					[[align=center]]:text-center
					[[align=right]]:text-right
				`,
				className,
			)}
			{...props}
		/>
	),
	tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
		<tr
			className={cn(`
				m-0 border-b
				last:border-b-0
			`, className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
		<ul
			className={cn('my-6 ms-4 list-disc text-muted-foreground', className)}
			{...props}
		/>
	),
}
