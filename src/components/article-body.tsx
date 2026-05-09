import type { MDXContent } from 'mdx/types'
import type { ComponentType } from 'react'

import { cn } from '@/lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: Record<string, ComponentType<any>>
	mdx: MDXContent
}

export function ArticleBody({ className, components, mdx: MDXContent }: ArticleBodyProps) {
	return (
		<div
			className={cn('article-body', className)}
		>
			<MDXContent components={components} />
		</div>
	)
}
