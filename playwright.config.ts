import process from 'node:process'

import { defineConfig } from '@playwright/test'

const PORT = 4329

// Screenshots are compared pixel for pixel, so the suite only runs in the Playwright image that
// matches @playwright/test: in CI (.github/workflows/e2e.yml) and locally through `pnpm e2e:docker`.
export default defineConfig({
	expect: {
		toHaveScreenshot: { animations: 'disabled', caret: 'hide' },
	},
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	reporter: process.env.GITHUB_ACTIONS
		? [['github'], ['html', { open: 'never' }]]
		: [['list'], ['html', { open: 'never' }]],
	snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
	testDir: 'e2e',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
	},
	webServer: {
		// The production worker under workerd. Its HTML cache persists in .wrangler and is keyed by
		// commit, so it is cleared first; otherwise a run before committing would get the last build.
		command: `rm -rf .wrangler/state/v3/cache && pnpm astro build && pnpm astro preview --port ${PORT} --ignore-lock`,
		timeout: 240_000,
		url: `http://localhost:${PORT}`,
	},
})
