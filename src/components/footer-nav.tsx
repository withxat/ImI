import { Dot } from 'lucide-react'
import { Fragment } from 'react'

const LINKS = [
	{ href: 'https://github.com/withxat', label: 'GitHub' },
	{ href: 'https://x.com/withxat', label: 'Twitter' },
	{ href: 'https://t.me/withxat', label: 'Telegram' },
	{ href: 'mailto:i@xat.sh', label: 'Email' },
] as const

export function FooterNav() {
	return (
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
	)
}
