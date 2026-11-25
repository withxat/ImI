/** localStorage key; keep in sync with inline bootstrap script. */
export const THEME_STORAGE_KEY = 'theme' as const

/** Matches `:root --background` and `.dark --background` (`oklch(0.145 0.004 260)`). */
export const THEME_COLOR_LIGHT = '#ffffff' as const
export const THEME_COLOR_DARK = '#090a0c' as const

/**
 * Blocking script injected in `root-layout.astro` — runs before first paint so
 * navigations / hydrate never flash the wrong palette.
 *
 * Mirrors theme application in `@/client/theme-switcher.ts`.
 */
export function getThemeBootstrapScript(): string {
	const k = JSON.stringify(THEME_STORAGE_KEY)
	const light = JSON.stringify(THEME_COLOR_LIGHT)
	const dark = JSON.stringify(THEME_COLOR_DARK)
	return `(()=>{try{var k=${k},l=${light},d=${dark};function a(){var s=localStorage.getItem(k),r=document.documentElement,m=s==='dark'||(s!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);r.classList.toggle('dark',m);r.classList.toggle('light',s==='light');var c=m?d:l;document.querySelectorAll('meta[name="theme-color"]').forEach(function(e){e.setAttribute('content',c)})}a();document.addEventListener('astro:after-swap',a)}catch(_){}})()`
}
