import type { Locale } from '@/lib/i18n/constants.ts'

export interface CodeBlockCopy {
	copied: string
	copyTooltip: string
	terminalTitle: string
}

export const codeBlockByLocale: Record<Locale, CodeBlockCopy>

export function codeBlockCopyFor(locale: Locale): CodeBlockCopy
