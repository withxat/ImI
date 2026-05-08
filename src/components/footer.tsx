import { Container } from './ui/primitives'

export function Footer() {
	return (
		<footer className="border-t bg-transparent">
			<Container className="flex items-center justify-between py-4 text-sm text-(--color-muted-foreground)">
				<span>Built with Waku and Tailwind</span>
				<div>
					visit
					{' '}
					<a
						className="underline decoration-(--color-border) underline-offset-4 transition-colors duration-150 hover:text-(--color-foreground) hover:decoration-current"
						href="https://waku.gg/"
						rel="noreferrer"
						target="_blank"
					>
						waku.gg
					</a>
					{' '}
					to learn more
				</div>
			</Container>
		</footer>
	)
}
