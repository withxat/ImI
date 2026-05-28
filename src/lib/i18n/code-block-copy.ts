import type { Locale } from '@/lib/i18n/constants.ts'

export interface CodeBlockCopy {
	/** Shown in the copy-success tooltip after clicking copy. */
	copied: string
	/** `title` on the copy button. */
	copyTooltip: string
	terminalTitle: string
}

export const codeBlockByLocale = {
	en: {
		copied: 'Copied!',
		copyTooltip: 'Copy code',
		terminalTitle: 'Terminal',
	},
	ja: {
		copied: 'コピーしました',
		copyTooltip: 'コードをコピー',
		terminalTitle: 'ターミナル',
	},
	zh: {
		copied: '已复制',
		copyTooltip: '复制代码',
		terminalTitle: '终端',
	},
} as const satisfies Record<Locale, CodeBlockCopy>

export function codeBlockCopyFor(locale: Locale): CodeBlockCopy {
	return codeBlockByLocale[locale]
}
