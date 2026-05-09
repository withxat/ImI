import { Link } from 'waku'

import { Container } from './ui/primitives'

export function Header() {
	return (
		<header className="border-b bg-transparent">
			<Container className="flex items-center justify-between py-4">
				<div className="flex items-center gap-6">
					<h2 className="text-sm font-semibold tracking-[0.18em] text-(--color-foreground) uppercase">
						<Link
							className="
								transition-colors duration-150
								hover:text-black
							"
							to="/"
						>
							IMI
						</Link>
					</h2>
					<nav className="flex items-center gap-4 text-sm text-muted-foreground">
						<Link
							className="
								transition-colors duration-150
								hover:text-(--color-foreground)
							"
							to="/about"
						>
							About
						</Link>
						<Link
							className="
								transition-colors duration-150
								hover:text-(--color-foreground)
							"
							to="/projects"
						>
							Projects
						</Link>
						<Link
							className="
								transition-colors duration-150
								hover:text-(--color-foreground)
							"
							to="/blog"
						>
							Blog
						</Link>
					</nav>
				</div>
				<p className="
					hidden text-sm text-muted-foreground
					sm:block
				"
				>
					Design engineer portfolio in progress
				</p>
			</Container>
		</header>
	)
}
