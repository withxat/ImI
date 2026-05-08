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
					<p className="mt-6 max-w-2xl text-base/7 text-muted-foreground">
						{data.body}
					</p>
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
		body:
      'This page now matches the simplified direction from the homepage instead of carrying the heavier presentation treatment.',
		headline: 'A trimmed-down version of the page shell.',
		title: 'About',
	}

	return data
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
