import type { Locale } from '@/lib/i18n/constants.ts'

import { pluginFramesTexts } from '@expressive-code/plugin-frames'

import { codeBlockCopyFor } from '@/lib/i18n/code-block-copy.ts'
import { LOCALES } from '@/lib/i18n/constants.ts'

const POST_LOCALE_RE = /(?:^|\/)posts\/(en|zh|ja)\//

function framesTextsFor(locale: Locale) {
	const { copied, copyTooltip, terminalTitle } = codeBlockCopyFor(locale)
	return {
		copyButtonCopied: copied,
		copyButtonTooltip: copyTooltip,
		terminalWindowFallbackTitle: terminalTitle,
	}
}

pluginFramesTexts.overrideTexts(undefined, framesTextsFor('en'))

for (const locale of LOCALES) {
	if (locale === 'en')
		continue
	pluginFramesTexts.addLocale(locale, framesTextsFor(locale))
}

export function getExpressiveCodeBlockLocale({ file }: { file?: { history?: string[], path?: string } }) {
	const path = file?.path ?? file?.history?.[0] ?? ''
	const match = path.match(POST_LOCALE_RE)
	return (match?.[1] as Locale | undefined) ?? 'en'
}
