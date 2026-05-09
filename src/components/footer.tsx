import { FooterNav } from '@/components/footer-nav'
import { FooterWanderer } from '@/components/footer-wanderer'
import { Container } from '@/components/ui/primitives'

export function Footer() {
	return (
		<footer>
			<Container className="pt-16 pb-28 text-base/7 text-muted-foreground">
				<div className="space-y-3">
					<FooterWanderer />
					<p className="text-sm text-muted-foreground">
						Connect through any of these:
					</p>
					<FooterNav />
				</div>
			</Container>
		</footer>
	)
}
