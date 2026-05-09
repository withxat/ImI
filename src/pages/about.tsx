import { Container, TextLink } from '../components/ui/primitives'

export default async function AboutPage() {
	const data = await getData()

	return (
		<section>
			<Container className="
				py-16
				md:py-28
			"
			>
				<title>{data.title}</title>
				<div className="space-y-0">
					<p className="font-medium text-foreground">About</p>
					<p className="text-muted-foreground">{data.headline}</p>
				</div>
				<div className="
					mt-28 space-y-5 text-base/7 text-muted-foreground
					md:mt-32
				"
				>
					{data.body.map(paragraph => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
				<div className="mt-8 flex flex-wrap gap-3">
					<TextLink to="/">
						Return home
					</TextLink>
				</div>
			</Container>
		</section>
	)
}

async function getData() {
	const data = {
		body: [
			`I'm a full-stack developer who also loves dabbling in design.`,
			'My background is in Intelligent Transportation Systems, where I learned a ton about software engineering and design.',
			`Right now, I'm a software engineer on the AI infra team at Central China Normal University.`,
		],
		headline: 'Hey, I\'m Xat!',
		title: 'About',
	}

	return data
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
