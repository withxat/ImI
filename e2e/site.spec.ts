import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'

const LOCALES = ['zh', 'en', 'ja'] as const
type Locale = typeof LOCALES[number]

const PAGES = [
	{ name: 'home', path: '/' },
	{ name: 'archive', path: '/post' },
	// Headings, images, code, and the AI-translation note in en and ja.
	{ name: 'post', path: '/post/how-i-access-the-internet-in-2026' },
	{ name: 'design', path: '/design' },
	{ name: 'resume', path: '/resume' },
	// A mistyped post link: the 404 page, with its guess at the post that was meant.
	{ name: 'not-found', path: '/post/dream-mail', status: 404 },
]

// Phones get touch emulation, so hover-only details stay away as they do on a real phone.
const SMALL_PHONE = { hasTouch: true, viewport: { height: 640, width: 320 } }
const PHONE = { hasTouch: true, viewport: { height: 844, width: 390 } }
const DESKTOP = { hasTouch: false, viewport: { height: 900, width: 1280 } }

const SHOTS = [
	{ colorScheme: 'light', device: DESKTOP, locales: LOCALES, name: 'desktop' },
	{ colorScheme: 'light', device: PHONE, locales: LOCALES, name: 'phone' },
	// Dark mode swaps colors, not layout, so one locale covers it.
	{ colorScheme: 'dark', device: DESKTOP, locales: ['zh'], name: 'desktop-dark' },
] as const

// Footer parts that change with the visitor, the time, or the commit: the greeting names the
// visitor's country, the stats count views and readers, and the commit link changes every push.
const HIDE_CHANGING_PARTS = `
	footer p:has(.wanderer-gradient-text), [data-site-stats] { display: none !important; }
	footer a[href*="/commit/"] { visibility: hidden !important; }
`

async function open(page: Page, path: string, locale: Locale, status = 200) {
	await page.context().addCookies([{ domain: 'localhost', name: 'imi_locale', path: '/', value: locale }])
	const response = await page.goto(path)
	expect(response?.status(), `status of ${path}`).toBe(status)
	await expect(page.locator('html')).toHaveAttribute('lang', locale)
}

// Walks the page so every reveal has run, then waits for images, fonts, and finite animations.
async function settle(page: Page) {
	await page.evaluate(async () => {
		const frame = () => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 60)))
		for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight / 2) {
			scrollTo({ behavior: 'instant', top })
			await frame()
		}
		scrollTo({ behavior: 'instant', top: 0 })

		const images = [...document.images]
		for (const image of images)
			image.loading = 'eager'
		await Promise.all(images.map(image => image.complete || new Promise((resolve) => {
			image.addEventListener('load', resolve, { once: true })
			image.addEventListener('error', resolve, { once: true })
		})))
		await document.fonts.ready
		await Promise.all(document.getAnimations()
			.filter(animation => animation.effect?.getTiming().iterations !== Infinity)
			.map(animation => animation.finished.catch(() => {})))
	})
}

async function expectNoSidewaysScroll(page: Page) {
	const { culprits, edge, width } = await page.evaluate(() => {
		const edge = document.documentElement.clientWidth
		const culprits = [...document.querySelectorAll('body *')]
			.filter(element => element.getBoundingClientRect().right > edge + 0.5 && !element.closest('[class*="custom-scrollbar"]'))
			.slice(0, 5)
			.map(element => `${element.tagName.toLowerCase()}.${[...element.classList].join('.')} "${element.textContent?.trim().slice(0, 30)}"`)
		return { culprits, edge, width: document.documentElement.scrollWidth }
	})
	// A pseudo-element can widen the page too, so culprits may be empty while the width is still off.
	expect(width, `page is wider than the screen; past the edge: ${culprits.join(', ') || 'no element boxes'}`).toBeLessThanOrEqual(edge)
}

for (const device of [SMALL_PHONE, PHONE, DESKTOP]) {
	test.describe(`${device.viewport.width}px`, () => {
		test.use(device)

		for (const locale of LOCALES) {
			for (const { name, path, status } of PAGES) {
				test(`${name} (${locale}) fits and runs clean`, async ({ page }) => {
					const problems: string[] = []
					page.on('pageerror', error => problems.push(`page error: ${error.message}`))
					page.on('console', (message) => {
						// A failed request is reported once, below, with its URL.
						if (message.type() === 'error' && !message.text().startsWith('Failed to load resource'))
							problems.push(`console error: ${message.text()}`)
					})
					page.on('response', (response) => {
						if (response.status() >= 400 && response.request().resourceType() !== 'document')
							problems.push(`${response.status()} ${response.url()}`)
					})

					await open(page, path, locale, status)
					await settle(page)
					await expectNoSidewaysScroll(page)
					expect(problems).toEqual([])
				})
			}
		}
	})
}

for (const shot of SHOTS) {
	test.describe(`looks, ${shot.name}`, () => {
		// Reduced motion shows every reveal at once, so a full-page screenshot has nothing half faded.
		test.use({ ...shot.device, colorScheme: shot.colorScheme, reducedMotion: 'reduce' })

		for (const locale of shot.locales) {
			for (const { name, path, status } of PAGES) {
				test(`${name} (${locale})`, async ({ page }) => {
					await open(page, path, locale, status)
					await settle(page)
					await expectNoSidewaysScroll(page)
					await expect(page).toHaveScreenshot(`${name}-${locale}-${shot.name}.png`, {
						fullPage: true,
						// Article photos are content, not layout, and would make up most of the bytes.
						mask: [page.locator('.article-body img')],
						maskColor: '#9ca3af',
						style: HIDE_CHANGING_PARTS,
					})
				})
			}
		}
	})
}
