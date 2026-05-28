type PageHandler = () => void

const handlers = new Set<PageHandler>()
let pageLoadInstalled = false
let scheduledFrame = 0

function flushHandlers() {
	for (const fn of handlers)
		fn()
}

function scheduleHandlers() {
	cancelAnimationFrame(scheduledFrame)
	scheduledFrame = requestAnimationFrame(() => {
		scheduledFrame = requestAnimationFrame(flushHandlers)
	})
}

function installPageLoad() {
	if (pageLoadInstalled)
		return
	pageLoadInstalled = true
	document.addEventListener('astro:page-load', scheduleHandlers)
}

/** Register a handler that runs after each ClientRouter navigation (and once on first paint). */
export function onAstroPageLoad(fn: PageHandler) {
	installPageLoad()
	handlers.add(fn)
	scheduleHandlers()
}
