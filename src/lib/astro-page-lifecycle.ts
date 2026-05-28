type PageHandler = () => void

const handlers = new Set<PageHandler>()
let beforePrepInstalled = false
let pageLoadInstalled = false
let pendingClientNavigation = false
let scheduledFrame = 0

export function markClientNavigationPending() {
	pendingClientNavigation = true
}

export function consumeClientNavigationPending() {
	const pending = pendingClientNavigation
	pendingClientNavigation = false
	return pending
}

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

function installBeforePreparation() {
	if (beforePrepInstalled)
		return
	beforePrepInstalled = true
	document.addEventListener('astro:before-preparation', (event) => {
		if (event.from)
			markClientNavigationPending()
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
	installBeforePreparation()
	installPageLoad()
	handlers.add(fn)
	scheduleHandlers()
}
