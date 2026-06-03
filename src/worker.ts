/// <reference path="../worker-configuration.d.ts" />

import { handle } from '@astrojs/cloudflare/handler'

import { SiteStats } from '@/worker/site-stats.ts'

export { SiteStats }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return handle(request, env, ctx)
	},
} satisfies ExportedHandler<Env>
