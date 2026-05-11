'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'waku'

interface RouteTransitionProps {
	children: React.ReactNode
}

const easeOut = [0.22, 1, 0.36, 1] as const

/** Enter-only: AnimatePresence + exit breaks when layout `children` is already the next route. */
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
			<motion.div
				animate={{
					filter: 'blur(0px)',
					opacity: 1,
					y: 0,
				}}
				initial={
					allowRouteTransition
						? {
								filter: reduceMotion ? 'blur(0px)' : 'blur(10px)',
								opacity: 0,
								y: reduceMotion ? 0 : 10,
							}
						: false
				}
				key={routeKey}
				transition={pageTransition}
			>
				{children}
			</motion.div>
		</motion.div>
	)
}
