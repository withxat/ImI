import { pluginFramesTexts } from '@expressive-code/plugin-frames'
import { defineEcConfig } from 'astro-expressive-code'

import { codeBlockCopyFor } from './src/lib/i18n/code-block-copy.mjs'

/** @type {import('./src/lib/i18n/constants.ts').Locale[]} */
const LOCALES = ['en', 'zh', 'ja']

/** @param {import('./src/lib/i18n/constants.ts').Locale} locale */
function framesTextsFor(locale) {
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

const POST_LOCALE_RE = /(?:^|\/)posts\/(en|zh|ja)\//

export default defineEcConfig({
	defaultLocale: 'en',
	getBlockLocale({ file }) {
		const path = file?.path ?? file?.history?.[0] ?? ''
		const match = path.match(POST_LOCALE_RE)
		return match?.[1] ?? 'en'
	},
})
