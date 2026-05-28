import { isLocale } from '@/lib/i18n/constants'
import { persistLocale } from '@/lib/i18n/persist-locale'

let dispose: (() => void) | null = null

export function initLocaleSwitcher() {
	dispose?.()
	const ac = new AbortController()
	const { signal } = ac

	document.querySelectorAll<HTMLButtonElement>('button[data-switch-locale]').forEach((btn) => {
		btn.addEventListener('click', () => {
			const target = btn.dataset.switchLocale
			if (!target || !isLocale(target))
				return
			persistLocale(target)
			window.location.reload()
		}, { signal })
	})

	dispose = () => ac.abort()
}
