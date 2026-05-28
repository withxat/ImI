import type * as React from 'react'

import { InfoIcon } from 'lucide-react'

import { CodeBlockCommand } from '@/components/mdx/code-block-command'
import { CodeCollapsibleWrapper } from '@/components/mdx/code-collapsible-wrapper'
import { CodeTabs } from '@/components/mdx/code-tabs'
import { ComponentPreview } from '@/components/mdx/component-preview'
import { ComponentSource } from '@/components/mdx/component-source'
import { MdxImage } from '@/components/mdx/mdx-image'
import { MediaQueryDemo } from '@/components/mdx/media-query-demo'
import { CopyButton } from '@/components/mdx/shared/copy-button'
import { getIconForLanguageExtension } from '@/components/mdx/shared/icons'
import { MdxPreWithCopy } from '@/components/mdx/shared/mdx-pre-with-copy'
import { MdxPrettyCodeFigcaption } from '@/components/mdx/shared/mdx-pretty-code-figcaption'
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

function isMdxBlockCode(
	props: React.ComponentProps<'code'> & {
		'__bun__'?: string
		'__npm__'?: string
		'__pnpm__'?: string
		'__raw__'?: string
		'__src__'?: string
		'__yarn__'?: string
		'data-language'?: string
	},
): boolean {
	if (typeof props['data-language'] === 'string' && props['data-language'].length > 0) {
		return true
	}
	const cn = props.className
	if (typeof cn === 'string' && /\blanguage-[\w-]+\b/.test(cn)) {
		return true
	}
	if (props.children != null && typeof props.children !== 'string') {
		return true
	}
	return false
}

export const mdxComponents = {
	a: ({ className, ...props }: React.ComponentProps<'a'>) => (
		<a
			className={cn('text-link font-medium', className)}
			{...props}
		/>
	),
	Accordion: ({ className, ...props }: React.ComponentProps<typeof Accordion>) => (
		<Accordion className={cn('not-first:mt-6', className)} {...props} />
	),
	AccordionItem: ({ className, ...props }: React.ComponentProps<typeof AccordionItem>) => (
		<AccordionItem className={cn('border-b-0!', className)} {...props} />
	),
	AccordionPanel: ({ className, ...props }: React.ComponentProps<typeof AccordionPanel>) => (
		<AccordionPanel
			className={cn(
				'mt-3 rounded-lg border border-dashed border-border px-3.5 py-2.5!',
				className,
			)}
			{...props}
		/>
	),
	AccordionTrigger: ({ className, ...props }: React.ComponentProps<typeof AccordionTrigger>) => (
		<AccordionTrigger
			className={cn(
				'py-0! text-base! leading-relaxed font-normal! text-muted-foreground',
				className,
			)}
			{...props}
		/>
	),
	Alert: ({ className, ...props }: React.ComponentProps<typeof Alert>) => (
		<Alert className={cn('my-6', className)} {...props} />
	),
	AlertAction,
	AlertDescription,
	AlertTitle,
	blockquote: ({ children, className, ...props }: React.ComponentProps<'blockquote'>) => (
		<blockquote
			className={cn(
				`relative my-8 ps-4 italic`,
				className,
			)}
			{...props}
		>
			<span
				aria-hidden="true"
				className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-muted-foreground/45"
			/>
			{children}
		</blockquote>
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
		const block = isMdxBlockCode({
			__bun__,
			__npm__,
			__pnpm__,
			__raw__,
			__src__,
			__yarn__,
			className,
			...props,
		})

		// Inline code (incl. plain `text` in prose).
		if (!block && typeof props.children === 'string') {
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

		// npm / multi-package command block.
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

		// Fenced / pretty-code block: copy lives on `MdxPreWithCopy`; optional legacy __raw__ hook.
		return (
			<>
				{__raw__ && <CopyButton src={__src__} value={__raw__} codeSurface />}
				<code className={className} {...props} />
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

		const isPrettyTitle = 'data-rehype-pretty-code-title' in props

		if (isPrettyTitle) {
			return (
				<MdxPrettyCodeFigcaption className={className} icon={iconExtension} {...props}>
					{children}
				</MdxPrettyCodeFigcaption>
			)
		}

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
		return (
			<figure
				className={cn(
					`
						data-rehype-pretty-code-figure:relative data-rehype-pretty-code-figure:my-6 data-rehype-pretty-code-figure:overflow-hidden data-rehype-pretty-code-figure:rounded-xl data-rehype-pretty-code-figure:bg-code data-rehype-pretty-code-figure:text-sm data-rehype-pretty-code-figure:shadow-sm data-rehype-pretty-code-figure:ring-1 data-rehype-pretty-code-figure:ring-black/10
						dark:data-rehype-pretty-code-figure:ring-white/12
					`,
					className,
				)}
				dir="ltr"
				tabIndex={-1}
				{...props}
			/>
		)
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
				<a href={`#${id}`}>
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
				<a href={`#${id}`}>
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
	}: React.ComponentProps<typeof MdxImage>) => (
		<MdxImage
			alt={alt || ''}
			className={cn('mt-6', className)}
			height={height}
			src={typeof src === 'string' ? src : ''}
			width={width}
			{...props}
		/>
	),
	img: ({ alt, className, ...props }: React.ComponentProps<typeof MdxImage>) => (
		<MdxImage alt={alt} className={className} {...props} />
	),
	InfoIcon,
	li: ({ className, ...props }: React.ComponentProps<'li'>) => (
		<li className={cn('mt-2', className)} {...props} />
	),
	Link: MdxLink,
	MediaQueryDemo,
	ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
		<ol
			className={cn('my-6 ms-0.5 list-decimal text-muted-foreground', className)}
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
	pre: (preProps: React.ComponentProps<'pre'>) => <MdxPreWithCopy {...preProps} />,
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
			className={cn('my-6 ms-0.5 list-disc text-muted-foreground', className)}
			{...props}
		/>
	),
}
