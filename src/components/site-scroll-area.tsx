'use client'

import type { ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { useRouter } from 'waku'

import { ScrollArea } from '@/components/mdx/ui/scroll-area'

export function SiteScrollArea({ children }: { children: ReactNode }) {
	const { path, query } = useRouter()
	const viewportRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		viewportRef.current?.scrollTo({ left: 0, top: 0 })
	}, [path, query])

	return (
		<ScrollArea
			className="fixed inset-0"
			viewportClassName="scroll-smooth"
			viewportProps={{ ref: viewportRef }}
			scrollbarGutter
		>
			{children}
		</ScrollArea>
	)
}
