import type * as React from 'react'

import { CodeCollapsibleWrapper } from '@/components/mdx/code-collapsible-wrapper'
import { CodeBlock } from '@/components/mdx/shared/code-block'
import { cn } from '@/lib/cn'

export function ComponentSource({
	className,
	code,
	collapsible = true,
	language,
	name,
	src,
	title,
}: React.ComponentProps<'div'> & {
	code?: string
	collapsible?: boolean
	language?: string
	name?: string
	src?: string
	title?: string
}) {
	const sourceCode = code

	if (!sourceCode) {
		return (
			<p className="text-sm text-muted-foreground">
				Source
				{' '}
				<code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem]">
					{name ?? src ?? 'unknown'}
				</code>
				{' '}
				not found in registry.
			</p>
		)
	}

	const lang = language ?? title?.split('.').pop() ?? 'tsx'

	if (!collapsible) {
		return (
			<div className={cn('relative', className)}>
				<CodeBlock code={sourceCode} language={lang} title={title} />
			</div>
		)
	}

	return (
		<CodeCollapsibleWrapper className={className}>
			<CodeBlock code={sourceCode} language={lang} title={title} />
		</CodeCollapsibleWrapper>
	)
}
