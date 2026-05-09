import { Link } from 'waku'

import { NameAudioButton } from '@/components/name-audio-button'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { getAllPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'

export default async function HomePage() {
	const data = await getData()
	const posts = getAllPosts().slice(0, 4)
	const projects = getProjects()

	return (
		<section>
			<title>{data.title}</title>
			<Container className="
				py-16
				md:py-28
			"
			>
				<div className="space-y-0">
					<p className="font-medium text-foreground">
						Xat
						<NameAudioButton />
					</p>
					<p className="text-muted-foreground">Design Engineer</p>
				</div>

				<div className="
					mt-28 space-y-28
					md:mt-32
				"
				>
					<section>
						<div className="space-y-5 text-base/7 text-muted-foreground">
							<p>I'm a full-stack developer who also loves dabbling in design.</p>
							<p>
								My background is in
								{' '}
								<i>Intelligent Transportation Systems</i>
								, where I learned a ton about software engineering and design.
							</p>
							<p>
								Right now, I'm a software engineer on the AI infra team at
								{' '}
								<a
									className="text-foreground underline decoration-border underline-offset-4"
									href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
									rel="noreferrer"
									target="_blank"
								>
									Central China Normal University
								</a>
								.
							</p>
							<p>Check out my creations below!</p>
						</div>
					</section>

					<section className="space-y-7">
						<div className="flex items-baseline justify-between gap-6">
							<Eyebrow className="font-semibold">Writing</Eyebrow>
							<Link
								className="
									font-ui text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150
									hover:text-foreground hover:decoration-current
								"
								to="/post"
							>
								View All
							</Link>
						</div>
						<div className="space-y-6">
							{posts.map((post) => {
								const slug = post.slug

								return (
									<Link
										className="
											block transition-colors duration-150
											hover:text-black
										"
										key={slug}
										to={`/post/${slug}`}
									>
										<h3 className="font-medium text-foreground">{post.title}</h3>
										<p className="mt-1 text-base/6 text-muted-foreground">{post.summary}</p>
									</Link>
								)
							})}
						</div>
					</section>

					<section className="space-y-7">
						<Eyebrow className="font-semibold">Project</Eyebrow>
						<div className="space-y-7">
							{projects.map(project => (
								<a
									className="
										block transition-colors duration-150
										hover:text-black
									"
									href={project.link}
									key={project.link}
									rel="noreferrer"
									target="_blank"
								>
									<h3 className="font-medium text-foreground">{project.title}</h3>
									<p className="mt-1 text-base/6 text-muted-foreground">{project.description}</p>
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
		title: 'Hi, Xat!',
	}
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
