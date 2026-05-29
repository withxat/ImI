import type { Messages } from './types'
import type { Locale } from '@/lib/i18n/constants'

import en from './en'
import ja from './ja'
import zh from './zh'

export type { Messages }

export const messages: Record<Locale, Messages> = {
	en,
	ja,
	zh,
}

export function getMessages(locale: Locale): Messages {
	return messages[locale]
}
