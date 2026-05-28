import type { Locale } from '@/lib/i18n/constants.ts'

import {
	codeBlockByLocale as codeBlockByLocaleData,
	codeBlockCopyFor as codeBlockCopyForFn,
} from '@/lib/i18n/code-block-copy.mjs'

export interface CodeBlockCopy {
	/** Shown in the copy-success tooltip after clicking copy. */
	copied: string
	/** `title` on the copy button. */
	copyTooltip: string
	terminalTitle: string
}

export const codeBlockByLocale = codeBlockByLocaleData as Record<Locale, CodeBlockCopy>

export const codeBlockCopyFor: (locale: Locale) => CodeBlockCopy = codeBlockCopyForFn
