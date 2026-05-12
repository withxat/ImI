import type { Locale } from '@/lib/i18n/constants'
import type { Messages } from '@/lib/i18n/messages'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { TextLink } from '@/components/ui/primitives'

interface SiteHeaderProps {
	locale: Locale
	messages: Pick<Messages, 'header' | 'localeSwitcher'>
	showBack?: boolean
}

export function SiteHeader({ locale, messages, showBack = false }: SiteHeaderProps) {
	return (
		<header className="space-y-2">
			<div className="flex items-baseline justify-between gap-4">
				{showBack
					? <TextLink to="/">{messages.header.goHome}</TextLink>
					: <div />}
				<LocaleSwitcher
					aria-label={messages.localeSwitcher.ariaLabel}
					currentLocale={locale}
				/>
			</div>
			<div className="flex justify-end">
				<ThemeSwitcher labels={messages.header.theme} />
			</div>
		</header>
	)
}
