import { Dot } from 'lucide-react'
import { Fragment } from 'react'

import { CountryFlag } from '@/components/country-flag'
import { Container } from '@/components/ui/primitives'
import { getVisitorGeo } from '@/lib/visitor-geo'

const LINKS = [
	{ href: 'https://github.com/withxat', label: 'GitHub' },
	{ href: 'https://x.com/withxat', label: 'Twitter' },
	{ href: 'https://t.me/withxat', label: 'Telegram' },
	{ href: 'mailto:i@xat.sh', label: 'Email' },
] as const

export function Footer() {
	const geo = getVisitorGeo()

	const wandererLine = geo.countryName
		? (
				<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground">
					<span>
						Hi, wanderer from
						{' '}
						{geo.countryName}
						.
					</span>
					<CountryFlag code={geo.countryCode} />
				</p>
			)
		: (
				<p className="text-foreground">
					Hi, wanderer—glad you found your way here.
				</p>
			)

	return (
		<footer>
			<Container className="pt-16 pb-28 text-base/7 text-muted-foreground">
				<div className="space-y-3">
					{wandererLine}
					<p className="text-sm text-muted-foreground">
						Connect through any of these:
					</p>
					<nav className="flex flex-wrap items-center gap-x-2 gap-y-1 font-ui text-sm">
						{LINKS.map((item, index) => (
							<Fragment key={item.href}>
								{index > 0 && (
									<Dot className="size-3 shrink-0 text-muted-foreground opacity-70" aria-hidden />
								)}
								<a
									className="text-link"
									href={item.href}
									rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
									target={item.href.startsWith('mailto:') ? undefined : '_blank'}
								>
									{item.label}
								</a>
							</Fragment>
						))}
					</nav>
				</div>
			</Container>
		</footer>
	)
}
