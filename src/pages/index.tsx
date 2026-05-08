import { BottomFade } from '../components/fades'
import { Container, Eyebrow, SurfacePanel, TextLink } from '../components/ui/primitives'

export default async function HomePage() {
	const data = await getData()

	return (
		<section className="relative flex min-h-[calc(100vh-121px)] items-center">
			<title>{data.title}</title>
			<Container className="
				flex flex-col items-center gap-10 py-10
				md:py-14
			"
			>
				<div className="w-full max-w-3xl space-y-4 text-center">
					<Eyebrow>Responsive layout</Eyebrow>
					<h1 className="
						text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
						lg:text-6xl
					"
					>
						{data.headline}
					</h1>
					<p className="mx-auto max-w-xl text-base/7 text-muted-foreground">
						{data.body}
					</p>
				</div>

				<div className="flex w-full flex-col items-center space-y-4">
					<SurfacePanel className="w-full max-w-2xl overflow-hidden">
						<div className="
							space-y-6 p-5
							sm:p-6
						"
						>
							{data.sections.map(section => (
								<div
									className="
										space-y-2 border-b pb-6
										last:border-b-0 last:pb-0
									"
									key={section.title}
								>
									<h2 className="text-lg font-medium text-(--color-foreground)">{section.title}</h2>
									<p className="text-sm/6 text-muted-foreground">{section.body}</p>
								</div>
							))}
						</div>
					</SurfacePanel>

					<TextLink to="/about">
						About page
					</TextLink>
				</div>
			</Container>
			<BottomFade />
		</section>
	)
}

async function getData() {
	return {
		body:
      'The layout now stays straightforward: stacked on small screens, two columns on large screens, with only a bottom blur fade added to the content panel.',
		headline: 'A simple page with responsive structure.',
		sections: [
			{
				body: 'Content stacks into a single column with tighter spacing and no decorative framing.',
				title: 'Mobile',
			},
			{
				body: 'The page switches to a two-column layout so the intro and content block can sit side by side.',
				title: 'Desktop',
			},
			{
				body: 'The fade is implemented as a small fixed-looking overlay inside the card using Tailwind gradients, blur, and mask-image.',
				title: 'Bottom fade',
			},
		],
		title: 'IMI',
	}
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
