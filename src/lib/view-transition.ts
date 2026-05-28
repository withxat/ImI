import { fade } from 'astro:transitions'

/** Opacity-only page transition — avoids double borders/shadows from blur crossfade. */
export const pageTransition = fade({ duration: '320ms' })
