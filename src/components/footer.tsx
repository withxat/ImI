import type { Locale } from '@/lib/i18n/constants'

import { FooterNav } from '@/components/footer-nav'
import { FooterWanderer } from '@/components/footer-wanderer'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { Container } from '@/components/ui/primitives'
import { getMessages } from '@/lib/i18n/messages'

export function Footer({ locale }: { locale: Locale }) {
	const m = getMessages(locale)

	return (
		<footer>
			<Container className="pt-16 pb-28 text-base/7 text-muted-foreground">
				<div className="space-y-5">
					<LocaleSwitcher
						aria-label={m.localeSwitcher.ariaLabel}
						className="pb-1"
						currentLocale={locale}
					/>
					<div className="space-y-3">
						<FooterWanderer copy={m.wanderer} locale={locale} />
						<p className="text-sm text-muted-foreground">
							{m.footer.connect}
						</p>
						<FooterNav />
					</div>
				</div>
			</Container>
		</footer>
	)
}
