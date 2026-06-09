import { fade } from 'astro:transitions'

/** Opacity-only page transition — avoids double borders/shadows from blur crossfade. */
export const pageTransition = fade({ duration: '320ms' })

/** Shared view-transition name for post list cards → article hero morph. */
export function postCardTransitionName(slug: string): string {
	return `post-${slug}`
}
