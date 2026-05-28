const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Matches site reveal easing; blur handled in globals.css keyframes. */
export function fadeBlur({ duration = '420ms' }: { duration?: number | string } = {}) {
	const anim = {
		new: {
			duration,
			easing: EASE,
			fillMode: 'both' as const,
			name: 'xatFadeBlurIn',
		},
		old: {
			duration,
			easing: EASE,
			fillMode: 'both' as const,
			name: 'xatFadeBlurOut',
		},
	}
	return { backwards: anim, forwards: anim }
}
