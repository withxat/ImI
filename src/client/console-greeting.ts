import { REPO_URL } from '@/lib/repo'

const GREETING: { en: string } & Record<string, string> = {
	en: 'Inspecting the page? The whole site is open source here:',
	ja: 'ソースをのぞいてる？このサイトはまるごとここで公開しています：',
	zh: '在看源码吗？整个站点都开源在这里：',
}

/** One line for whoever opens the devtools, once per visit. */
export function greetConsole() {
	const locale = document.querySelector<HTMLElement>('[data-site-locale]')?.dataset.siteLocale ?? 'en'
	// eslint-disable-next-line no-console
	console.log(
		`%cXat%c ${GREETING[locale] ?? GREETING.en}\n${REPO_URL}`,
		'color: oklch(0.673 0.117 3); font-size: 1.5em; font-style: italic; font-weight: 800',
		'',
	)
}
