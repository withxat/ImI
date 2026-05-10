import type { MDXContent } from 'mdx/types'
import type { ComponentType } from 'react'

import { cn } from '@/lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: Record<string, ComponentType<any>>
	mdx: MDXContent
	/** Line stagger (blur + fade) on block-level MDX nodes; DOM order ≈ top → bottom */
	reveal?: boolean
}

export function ArticleBody({
	className,
	components,
	mdx: MDXContent,
	reveal = true,
}: ArticleBodyProps) {
	return (
		<div
			className={cn('article-body', reveal && 'article-reveal-lines', className)}
		>
			<MDXContent components={components} />
		</div>
	)
}
