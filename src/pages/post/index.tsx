import { unstable_redirect } from 'waku/router/server'

import { DEFAULT_LOCALE } from '@/lib/i18n/constants'
import { withLocale } from '@/lib/i18n/paths'

export default function LegacyBlogIndexRedirect() {
	unstable_redirect(withLocale(DEFAULT_LOCALE, '/post'))
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
