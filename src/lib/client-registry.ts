export interface ClientModule {
	/** Clean up the module. Called before re-initialization on navigation. */
	dispose?: () => void
	/** Initialize the module. Called on page load. */
	init: (animate: boolean) => void
}

const modules = new Map<string, ClientModule>()
let initialized = false

/**
 * Register a client-side module with a unique name.
 * Modules are initialized in registration order.
 */
export function registerModule(name: string, module: ClientModule): void {
	if (modules.has(name)) {
		// Dispose existing before replacing
		modules.get(name)?.dispose?.()
	}
	modules.set(name, module)

	// If already initialized, init immediately
	if (initialized) {
		module.init(true)
	}
}

/**
 * Initialize all registered modules.
 * Called once on first page load and after each ClientRouter navigation.
 */
export function runAll(animate: boolean): void {
	for (const module of modules.values()) {
		module.init(animate)
	}
	initialized = true
}

/**
 * Dispose all registered modules.
 * Useful for cleanup before page transitions.
 */
export function disposeAll(): void {
	for (const module of modules.values()) {
		module.dispose?.()
	}
}

/**
 * Create a module with AbortController-based lifecycle.
 * Convenience factory for the common pattern of "init creates AC, dispose aborts it."
 */
export function createAbortableModule(
	initFn: (signal: AbortSignal, animate: boolean) => void,
): ClientModule {
	let controller: AbortController | null = null

	return {
		dispose() {
			controller?.abort()
			controller = null
		},
		init(animate: boolean) {
			controller?.abort()
			controller = new AbortController()
			initFn(controller.signal, animate)
		},
	}
}
