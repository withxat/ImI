import { THEME_STORAGE_KEY } from '@/lib/theme/constants'

export type Theme = 'dark' | 'light' | 'system'

export function readStoredTheme(): Theme {
	try {
		const v = localStorage.getItem(THEME_STORAGE_KEY)
		if (v === 'light' || v === 'dark' || v === 'system')
			return v
	}
	catch {
	}
	return 'system'
}
