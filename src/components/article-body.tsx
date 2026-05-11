import type { MDXContent } from 'mdx/types'
import type { ComponentType } from 'react'

import { ArticleRevealClient } from '@/components/article-reveal-client'
import { cn } from '@/lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: Record<string, ComponentType<any>>
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
	if (reveal) {
		return (
			<ArticleRevealClient className={className}>
				<MDXContent components={components} />
			</ArticleRevealClient>
		)
	}

	return (
		<div className={cn('article-body', className)}>
			<MDXContent components={components} />
		</div>
	)
}
