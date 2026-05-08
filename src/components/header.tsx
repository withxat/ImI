import { Link } from 'waku'

import { Container } from './ui/primitives'

export function Header() {
	return (
		<header className="border-b bg-transparent">
			<Container className="flex items-center justify-between py-4">
				<h2 className="text-sm font-semibold tracking-[0.18em] text-(--color-foreground) uppercase">
					<Link className="transition-colors duration-150 hover:text-black" to="/">
						IMI
					</Link>
				</h2>
				<p className="hidden text-sm text-(--color-muted-foreground) sm:block">
					Design engineer portfolio in progress
				</p>
			</Container>
		</header>
	)
}
