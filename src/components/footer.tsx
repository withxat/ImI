import type { Locale } from '@/lib/i18n/constants'

import MoeIcpIcon from '@/assets/icons/moe-icp.svg?react'
import { FooterNav } from '@/components/footer-nav'
import { FooterWanderer } from '@/components/footer-wanderer'
import { Container } from '@/components/ui/primitives'
import { getMessages } from '@/lib/i18n/messages'

export function Footer({ locale }: { locale: Locale }) {
	const m = getMessages(locale)

	return (
		<footer>
			<Container className="pt-28 pb-8 text-base/7 text-muted-foreground">
				<div className="space-y-3">
					<FooterWanderer copy={m.wanderer} locale={locale} />
					<p className="text-sm text-muted-foreground">
						{m.footer.connect}
					</p>
					<FooterNav />
					<a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground" href="https://icp.gov.moe/?keyword=20264698" target="_blank">
						<MoeIcpIcon className="size-3.5 animate-pulse text-primary" aria-hidden />
						{m.footer.moeIcp}
					</a>
				</div>
			</Container>
		</footer>
	)
}
