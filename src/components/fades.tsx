import { cn } from '../lib/cn'

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
				'pointer-events-none fixed inset-x-0 bottom-0 z-10 backdrop-blur-[6px]',
				'bg-linear-to-b from-transparent to-(--color-background)',
				'mask-[linear-gradient(to_top,var(--color-background)_18%,transparent)]',
				className,
			)}
			style={{ height }}
			aria-hidden
		/>
	)
}
