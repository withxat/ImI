import { cn } from '@/lib/cn'

interface BottomFadeProps {
	className?: string
	height?: number
}

export function BottomFade({
	className,
	height = 112,
}: BottomFadeProps) {
	return (
		<div
			className={cn(
				'pointer-events-none fixed inset-x-0 z-10 transform-[translateZ(0)] opacity-[0.99] backdrop-blur-[6px]',
				'-bottom-[env(safe-area-inset-bottom,0)]',
				'bg-linear-to-b from-transparent to-background',
				'mask-[linear-gradient(to_top,var(--color-background)_18%,transparent)]',
				className,
			)}
			style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
			aria-hidden
		/>
	)
}
