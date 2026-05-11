import { unstable_redirect } from 'waku/router/server'

import { DEFAULT_LOCALE } from '@/lib/i18n/constants'
import { withLocale } from '@/lib/i18n/paths'

export default function RootRedirect() {
	unstable_redirect(withLocale(DEFAULT_LOCALE, '/'))
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
