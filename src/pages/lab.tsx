import { Link } from 'waku'

import { Container, Eyebrow } from '@/components/ui/primitives'
import { getLabItems } from '@/lib/projects'

export default async function LabPage() {
	const data = await getData()
	const items = getLabItems()

	return (
		<section>
			<title>{data.title}</title>
			<Container className="page-shell">
				<div className="space-y-3">
					<p className="font-ui text-sm text-muted-foreground">
						<Link className="text-link" to="/">
							Home
						</Link>
					</p>
					<h1 className="text-2xl font-medium text-foreground">Lab</h1>
					<p className="max-w-prose text-base/7 text-muted-foreground">
						A playground for side quests: presets, hardware hacks, and soon AI UI prototypes and
						motion studies. Nothing here is positioned as shipped product work—just honest tinkering.
					</p>
				</div>

				<div className="home-sections">
					<section className="space-y-7">
						<Eyebrow className="font-semibold">Experiments</Eyebrow>
						<div className="space-y-6">
							{items.map(item => (
								<a
									className="entry-link"
									href={item.link}
									key={item.link}
									rel="noreferrer"
									target="_blank"
								>
									<h2 className="font-medium text-foreground">{item.title}</h2>
									<p className="mt-1 text-base/6 text-muted-foreground">{item.description}</p>
								</a>
							))}
						</div>
					</section>
				</div>
			</Container>
		</section>
	)
}

async function getData() {
	return {
		title: 'Lab — Xat',
	}
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
