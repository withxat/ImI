import { REPO_URL } from '@/lib/repo'

const GREETING: { en: string } & Record<string, string> = {
	en: 'Hi, you found the back door. The whole site is open source:',
	ja: 'やあ、裏口を見つけたね。このサイトのソースはすべてここにあるよ：',
	zh: '嗨，被你发现了。这个站点的源码都在这里：',
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
