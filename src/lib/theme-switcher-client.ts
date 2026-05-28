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
	document.querySelectorAll<HTMLButtonElement>('[data-set-theme]').forEach((btn) => {
		const active = btn.dataset.setTheme === theme
		btn.classList.toggle('text-foreground', active)
		btn.classList.toggle('text-muted-foreground', !active)
	})
}

export function initThemeSwitcher() {
	dispose?.()

	const ac = new AbortController()
	const { signal } = ac

	document.querySelectorAll<HTMLElement>('[data-theme-switcher]').forEach((container) => {
		const toggleBtn = container.querySelector<HTMLButtonElement>('[data-theme-toggle]')
		const menu = container.querySelector<HTMLElement>('[data-theme-menu]')
		if (!toggleBtn || !menu)
			return

		let theme: Theme = readStoredTheme()
		applyTheme(theme)
		syncCurrentIcon(theme)

		const close = () => menu.classList.add('hidden')
		const open = () => menu.classList.remove('hidden')
		const isOpen = () => !menu.classList.contains('hidden')

		toggleBtn.addEventListener('click', () => {
			if (isOpen())
				close()
			else open()
		}, { signal })

		container.querySelectorAll<HTMLButtonElement>('[data-set-theme]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const next = btn.dataset.setTheme as Theme
				try {
					localStorage.setItem(THEME_STORAGE_KEY, next)
				}
				catch {}
				theme = next
				applyTheme(theme)
				syncCurrentIcon(theme)
				close()
			}, { signal })
		})

		document.addEventListener('pointerdown', (e) => {
			if (!isOpen())
				return
			if (!container.contains(e.target as Node))
				close()
		}, { signal })

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && isOpen())
				close()
		}, { signal })

		const mq = matchMedia('(prefers-color-scheme:dark)')
		mq.addEventListener('change', () => {
			if (theme === 'system')
				applyTheme('system')
		}, { signal })
	})

	dispose = () => ac.abort()
}
