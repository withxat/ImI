import { Link } from 'waku'

import { BottomFade } from '../components/fades'

export default async function HomePage() {
	const data = await getData()

	return (
		<section className="relative flex min-h-[calc(100vh-121px)] items-center">
			<title>{data.title}</title>
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
				<div className="w-full max-w-3xl space-y-4 text-center">
					<p className="text-sm text-(--page-muted)">Responsive layout</p>
					<h1 className="text-4xl font-semibold tracking-tight text-(--page-ink) sm:text-5xl lg:text-6xl">
						{data.headline}
					</h1>
					<p className="mx-auto max-w-xl text-base leading-7 text-(--page-muted)">
						{data.body}
					</p>
				</div>

				<div className="flex w-full flex-col items-center space-y-4">
					<div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-(--page-border) bg-(--page-surface)">
						<div className="space-y-6 p-5 sm:p-6">
							{data.sections.map(section => (
								<div
									className="space-y-2 border-b border-(--page-border) pb-6 last:border-b-0 last:pb-0"
									key={section.title}
								>
									<h2 className="text-lg font-medium text-(--page-ink)">{section.title}</h2>
									<p className="text-sm leading-6 text-(--page-muted)">{section.body}</p>
								</div>
							))}
						</div>
					</div>

					<Link
						className="inline-flex items-center text-sm font-medium text-(--page-ink) underline underline-offset-4"
						to="/about"
					>
						About page
					</Link>
				</div>
			</div>
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
