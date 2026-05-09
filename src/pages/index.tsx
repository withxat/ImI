import { Link } from 'waku'

import { Container, Eyebrow, SurfacePanel, TextLink } from '../components/ui/primitives'
import { formatPostDate, getAllPosts } from '../lib/blog'
import { getProjects } from '../lib/projects'

export default async function HomePage() {
	const data = await getData()
	const posts = getAllPosts().slice(0, 4)
	const projects = getProjects()

	return (
		<section>
			<title>{data.title}</title>
			<Container className="
				py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-5">
					<Eyebrow>Design Engineer</Eyebrow>
					<h1 className="
						text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
					"
					>
						I create clean design and build it to life
					</h1>
				</div>

				<div className="space-y-6">
					<SurfacePanel className="
						h-fit p-5
						sm:p-6
					"
					>
						<div className="space-y-4 text-base/7 text-muted-foreground">
							<p className="text-(--color-foreground)">Hey, I'm Xat!</p>
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
									className="text-(--color-foreground) underline decoration-border underline-offset-4"
									href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
									rel="noreferrer"
									target="_blank"
								>
									Central China Normal University
								</a>
								.
							</p>
							<p>Check out my creations below!</p>
							<audio preload="auto" src="/xat.mp3" controls>
								Say My Name
							</audio>
						</div>
					</SurfacePanel>

					<div className="space-y-6">
						<section>
							<div className="mb-3 flex items-center justify-between gap-4">
								<h2 className="text-xl font-semibold tracking-tight text-(--color-foreground)">Writing</h2>
								<TextLink to="/blog">View All</TextLink>
							</div>
							<div className="space-y-3">
								{posts.map((post) => {
									const slug = post.info.path.replace(/\.mdx?$/, '')

									return (
										<SurfacePanel
											className="
												transition-transform duration-150
												hover:-translate-y-0.5
											"
											key={slug}
										>
											<Link
												className="
													block space-y-2 p-5
													sm:p-6
												"
												to={`/blog/${slug}`}
											>
												<p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
													{formatPostDate(post.date)}
												</p>
												<h3 className="text-lg font-semibold tracking-tight text-(--color-foreground)">
													{post.title}
												</h3>
												<p className="text-sm/6 text-muted-foreground">{post.summary}</p>
											</Link>
										</SurfacePanel>
									)
								})}
							</div>
						</section>

						<section>
							<div className="mb-3 flex items-center justify-between gap-4">
								<h2 className="text-xl font-semibold tracking-tight text-(--color-foreground)">Project</h2>
								<TextLink to="/projects">View All</TextLink>
							</div>
							<div className="space-y-3">
								{projects.map(project => (
									<SurfacePanel
										className="
											transition-transform duration-150
											hover:-translate-y-0.5
										"
										key={project.id}
									>
										<a
											className="
												block space-y-2 p-5
												sm:p-6
											"
											href={project.link}
											rel="noreferrer"
											target="_blank"
										>
											<h3 className="text-lg font-semibold tracking-tight text-(--color-foreground)">
												{project.title}
											</h3>
											<p className="text-sm/6 text-muted-foreground">{project.description}</p>
										</a>
									</SurfacePanel>
								))}
							</div>
						</section>
					</div>
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
