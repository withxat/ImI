import { Container, Eyebrow, SurfacePanel, TextLink } from '../components/ui/primitives'

export default async function AboutPage() {
	const data = await getData()

	return (
		<section>
			<Container className="
				max-w-4xl py-10
				md:py-14
			"
			>
				<SurfacePanel className="
					w-full p-6
					sm:p-8
				"
				>
					<title>{data.title}</title>
					<Eyebrow className="mb-4">About</Eyebrow>
					<h1 className="
						max-w-2xl text-3xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-4xl
					"
					>
						{data.headline}
					</h1>
					<div className="mt-6 max-w-2xl space-y-4 text-base/7 text-muted-foreground">
						{data.body.map(paragraph => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
					<div className="mt-8 flex flex-wrap gap-3">
						<TextLink to="/">
							Return home
						</TextLink>
					</div>
				</SurfacePanel>
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
