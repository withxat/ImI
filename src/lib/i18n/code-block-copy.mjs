/** @type {const} */
export const codeBlockByLocale = {
	en: {
		copied: 'Copied!',
		copyTooltip: 'Copy code',
		terminalTitle: 'Terminal',
	},
	zh: {
		copied: '已复制',
		copyTooltip: '复制代码',
		terminalTitle: '终端',
	},
	ja: {
		copied: 'コピーしました',
		copyTooltip: 'コードをコピー',
		terminalTitle: 'ターミナル',
	},
}

/** @param {'en' | 'zh' | 'ja'} locale */
export function codeBlockCopyFor(locale) {
	return codeBlockByLocale[locale]
}
