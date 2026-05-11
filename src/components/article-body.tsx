import type { MDXComponents, MDXContent } from 'mdx/types'

import { ArticleRevealClient } from '@/components/article-reveal-client'
import { mdxComponents } from '@/components/mdx'
import { cn } from '@/lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: MDXComponents
	mdx: MDXContent
	/** Blur + fade on block-level MDX nodes (viewport-aware stagger / scroll-in) */
	reveal?: boolean
}

export function ArticleBody({
	className,
	components,
	mdx: MDXContent,
	reveal = true,
}: ArticleBodyProps) {
	const componentsWithDefaults = {
		...mdxComponents,
		...components,
	} as MDXComponents

	if (reveal) {
		return (
			<ArticleRevealClient className={className}>
				<MDXContent components={componentsWithDefaults} />
			</ArticleRevealClient>
		)
	}

	return (
		<div className={cn('article-body', className)}>
			<MDXContent components={componentsWithDefaults} />
		</div>
	)
}
