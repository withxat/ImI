'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'waku'

interface RouteTransitionProps {
	children: React.ReactNode
}

const easeOut = [0.22, 1, 0.36, 1] as const

export function RouteTransition({ children }: RouteTransitionProps) {
	const { path, query, unstable_events } = useRouter()
	const [pending, setPending] = useState(false)
	const [allowRouteTransition, setAllowRouteTransition] = useState(false)
	const reduceMotion = useReducedMotion()
	const routeKey = `${path}?${query}`

	const pageTransition = useMemo(
		() =>
			reduceMotion
				? { duration: 0 }
				: {
						duration: 0.36,
						ease: easeOut,
					},
		[reduceMotion],
	)

	const shellTransition = useMemo(
		() =>
			reduceMotion
				? { duration: 0 }
				: {
						duration: 0.2,
						ease: easeOut,
					},
		[reduceMotion],
	)

	useEffect(() => {
		const onStart = () => setPending(true)
		const onComplete = () => {
			setPending(false)
			setAllowRouteTransition(true)
		}
		unstable_events.on('start', onStart)
		unstable_events.on('complete', onComplete)
		return () => {
			unstable_events.off('start', onStart)
			unstable_events.off('complete', onComplete)
		}
	}, [unstable_events])

	return (
		<motion.div
			animate={{
				opacity: pending && !reduceMotion ? 0.82 : 1,
				scale: pending && !reduceMotion ? 0.996 : 1,
			}}
			className="origin-top"
			style={{ pointerEvents: pending ? 'none' : 'auto' }}
			transition={shellTransition}
		>
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					initial={
						allowRouteTransition
							? { opacity: 0, y: reduceMotion ? 0 : 10 }
							: false
					}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
					key={routeKey}
					transition={pageTransition}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</motion.div>
	)
}
