'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'waku'

import { cn } from '@/lib/cn'

interface RouteTransitionProps {
	children: React.ReactNode
}

export function RouteTransition({ children }: RouteTransitionProps) {
	const { path, query, unstable_events } = useRouter()
	const [pending, setPending] = useState(false)
	const [allowPageEnterMotion, setAllowPageEnterMotion] = useState(false)
	const routeKey = `${path}?${query}`

	useEffect(() => {
		const onStart = () => setPending(true)
		const onComplete = () => {
			setPending(false)
			setAllowPageEnterMotion(true)
		}
		unstable_events.on('start', onStart)
		unstable_events.on('complete', onComplete)
		return () => {
			unstable_events.off('start', onStart)
			unstable_events.off('complete', onComplete)
		}
	}, [unstable_events])

	return (
		<div
			className={cn(
				'origin-top transition-[opacity,transform] duration-200 ease-out',
				'motion-reduce:transition-none',
				pending && 'pointer-events-none scale-[0.996] opacity-[0.82]',
			)}
		>
			<div
				className={cn(
					allowPageEnterMotion && 'animate-route-enter',
					allowPageEnterMotion && 'motion-reduce:animate-none',
				)}
				key={routeKey}
			>
				{children}
			</div>
		</div>
	)
}
