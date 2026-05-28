/** localStorage key; keep in sync with inline bootstrap script. */
export const THEME_STORAGE_KEY = 'theme' as const

/**
 * Blocking script injected in `_layout.tsx` — runs before first paint so
 * navigations / hydrate never flash the wrong palette.
 *
 * Mirrors theme application in `@/components/theme-switcher.tsx`.
 */
export function getThemeBootstrapScript(): string {
	const k = JSON.stringify(THEME_STORAGE_KEY)
	return `(()=>{try{var k=${k};function a(){var s=localStorage.getItem(k),r=document.documentElement;if(s==='dark'){r.classList.add('dark');r.classList.remove('light')}else if(s==='light'){r.classList.remove('dark');r.classList.add('light')}else{r.classList.remove('light');r.classList.toggle('dark',matchMedia('(prefers-color-scheme:dark)').matches)}}a();document.addEventListener('astro:after-swap',a)}catch(_){}})()`
}
