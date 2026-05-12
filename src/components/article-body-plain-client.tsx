'use client'

import type { ReactNode } from 'react'

import { useRef } from 'react'

import { useArticlePhotoswipe } from '@/hooks/use-article-photoswipe'
import { cn } from '@/lib/cn'

interface ArticleBodyPlainClientProps {
	children: ReactNode
	className?: string
}

/** Same `article-body` root as reveal mode, without stagger — keeps PhotoSwipe delegation. */
export function ArticleBodyPlainClient({ children, className }: ArticleBodyPlainClientProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	useArticlePhotoswipe(rootRef)

	return (
		<div className={cn('article-body', className)} ref={rootRef}>
			{children}
		</div>
	)
}
