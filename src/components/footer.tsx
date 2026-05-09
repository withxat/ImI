import { Container } from './ui/primitives'

export function Footer() {
	return (
		<footer className="border-t bg-transparent">
			<Container className="
				flex flex-col gap-3 py-5 text-sm text-muted-foreground
				sm:flex-row sm:items-end sm:justify-between
			"
			>
				<div className="space-y-1">
					<p>&copy; Xat 2025</p>
					<p>Coding with Love, Exploring the World.</p>
				</div>
				<nav className="flex flex-wrap gap-x-3 gap-y-1">
					<a
						className="
							underline decoration-border underline-offset-4 transition-colors duration-150
							hover:text-(--color-foreground) hover:decoration-current
						"
						href="https://github.com/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Github
					</a>
					<a
						className="
							underline decoration-border underline-offset-4 transition-colors duration-150
							hover:text-(--color-foreground) hover:decoration-current
						"
						href="https://x.com/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Twitter/X
					</a>
					<a
						className="
							underline decoration-border underline-offset-4 transition-colors duration-150
							hover:text-(--color-foreground) hover:decoration-current
						"
						href="https://t.me/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Telegram
					</a>
					<a
						className="
							underline decoration-border underline-offset-4 transition-colors duration-150
							hover:text-(--color-foreground) hover:decoration-current
						"
						href="mailto:i@xat.sh"
					>
						Email
					</a>
					<span>CC BY-SA 4.0</span>
					<span>not by AI</span>
				</nav>
			</Container>
		</footer>
	)
}
