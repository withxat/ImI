'use client'

import type { ConstructionIconHandle } from '@/components/ui/construction'

import { useEffect, useRef } from 'react'

import { ConstructionIcon } from '@/components/ui/construction'

export function ConstructionStripesIcon({ className }: { className?: string }) {
	const iconRef = useRef<ConstructionIconHandle>(null)

	useEffect(() => {
		const icon = iconRef.current
		icon?.startAnimation()
		return () => {
			icon?.stopAnimation()
		}
	}, [])

	return (
		<ConstructionIcon
			className={className}
			ref={iconRef}
			size={16}
		/>
	)
}
