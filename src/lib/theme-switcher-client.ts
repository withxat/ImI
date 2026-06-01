import type { Theme } from '@/lib/theme/read-stored-theme'

import { THEME_STORAGE_KEY } from '@/lib/theme/constants'
import { readStoredTheme } from '@/lib/theme/read-stored-theme'

let dispose: (() => void) | null = null

function applyTheme(theme: Theme) {
	const el = document.documentElement
	if (theme === 'system') {
		el.classList.toggle('dark', matchMedia('(prefers-color-scheme:dark)').matches)
		el.classList.remove('light')
	}
	else {
		el.classList.toggle('dark', theme === 'dark')
		el.classList.toggle('light', theme === 'light')
	}
}

function syncCurrentIcon(theme: Theme) {
	document.querySelectorAll<HTMLElement>('[data-theme-current] [data-icon]').forEach((el) => {
		el.hidden = el.dataset.icon !== theme
	})
	document.querySelectorAll<HTMLElement>('[data-set-theme]').forEach((el) => {
		const active = el.dataset.setTheme === theme
		el.classList.toggle('text-foreground', active)
		el.classList.toggle('text-muted-foreground', !active)
	})
}

function setDropdownValue(menu: HTMLElement, theme: Theme) {
	menu.dispatchEvent(new CustomEvent('dropdown-menu:set', {
		bubbles: true,
		detail: { value: theme },
	}))
}

export function initThemeSwitcher() {
	dispose?.()

	const ac = new AbortController()
	const { signal } = ac

	document.querySelectorAll<HTMLElement>('[data-theme-switcher]').forEach((menu) => {
		let theme: Theme = readStoredTheme()
		applyTheme(theme)
		syncCurrentIcon(theme)
		setDropdownValue(menu, theme)

		menu.addEventListener('dropdown-menu:value-change', (event) => {
			const { value } = (event as CustomEvent<{ value: string }>).detail
			if (value !== 'system' && value !== 'light' && value !== 'dark')
				return

			const next = value as Theme
			try {
				localStorage.setItem(THEME_STORAGE_KEY, next)
			}
			catch {}
			theme = next
			applyTheme(theme)
			syncCurrentIcon(theme)
		}, { signal })

		const mq = matchMedia('(prefers-color-scheme:dark)')
		mq.addEventListener('change', () => {
			if (theme === 'system')
				applyTheme('system')
		}, { signal })
	})

	dispose = () => ac.abort()
}
