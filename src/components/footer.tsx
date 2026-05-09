import { Container } from './ui/primitives'

export function Footer() {
	return (
		<footer>
			<Container className="space-y-3 py-16 text-base/7 text-muted-foreground">
				<p>Coding with Love, Exploring the World.</p>
				<nav className="flex flex-wrap gap-x-3 gap-y-1 font-ui text-sm">
					<a
						className="
							underline decoration-border underline-offset-4 transition-colors duration-150
							hover:text-foreground hover:decoration-current
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
							hover:text-foreground hover:decoration-current
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
							hover:text-foreground hover:decoration-current
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
							hover:text-foreground hover:decoration-current
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
