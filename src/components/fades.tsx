interface BottomFadeProps {
	className?: string
	height?: number
}

function cx(...classes: Array<false | null | string | undefined>) {
	return classes.filter(Boolean).join(' ')
}

export function BottomFade({
	className,
	height = 112,
}: BottomFadeProps) {
	return (
		<div
			className={cx(
				'pointer-events-none fixed inset-x-0 bottom-0 z-10 backdrop-blur-[6px]',
				'bg-linear-to-b from-transparent to-[var(--page-bg)]',
				'[mask-image:linear-gradient(to_top,var(--page-bg)_18%,transparent)]',
				className,
			)}
			style={{ height }}
			aria-hidden
		/>
	)
}
