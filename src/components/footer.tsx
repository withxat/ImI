import { Container } from '@/components/ui/primitives'

export function Footer() {
	return (
		<footer>
			<Container className="pt-16 pb-28 text-base/7 text-muted-foreground">
				<nav className="flex flex-wrap gap-x-3 gap-y-1 font-ui text-sm">
					<a
						className="text-link"
						href="https://github.com/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Github
					</a>
					<a
						className="text-link"
						href="https://x.com/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Twitter/X
					</a>
					<a
						className="text-link"
						href="https://t.me/withxat"
						rel="noreferrer"
						target="_blank"
					>
						Telegram
					</a>
					<a
						className="text-link"
						href="mailto:i@xat.sh"
					>
						Email
					</a>
				</nav>
			</Container>
		</footer>
	)
}
