import { Link } from 'waku'

import { NameAudioButton } from '@/components/name-audio-button'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { getAllPosts } from '@/lib/blog'
import { getCapabilities } from '@/lib/projects'

export default async function HomePage() {
	const data = await getData()
	const posts = getAllPosts().slice(0, 4)
	const capabilities = getCapabilities()

	return (
		<section>
			<title>{data.title}</title>
			<Container className="page-shell">
				<div className="space-y-0">
					<p className="font-medium text-foreground">
						Xat
						<NameAudioButton />
					</p>
					<p className="text-muted-foreground">Design Engineer</p>
					<p className="mt-3 max-w-prose text-base/7 text-foreground">
						Building production-quality interfaces and AI-native products.
					</p>
				</div>

				<div className="home-sections">
					<section>
						<div className="space-y-5 text-base/7 text-muted-foreground">
							<p>
								I design and ship applied AI—interfaces, workflows, and developer-facing
								surfaces where intelligence is part of the UX, not a bolt-on.
							</p>
							<p>
								My background is in
								{' '}
								<i>Intelligent Transportation Systems</i>
								: software and design where physical infrastructure meets digital systems.
							</p>
							<p>
								Today I work at
								{' '}
								<a
									className="text-link text-link-strong"
									href="https://en.wikipedia.org/wiki/Central_China_Normal_University"
									rel="noreferrer"
									target="_blank"
								>
									Central China Normal University
								</a>
								{' '}
								on production AI products and intelligent experiences—exploring how models
								reshape interfaces, collaboration, and tools.
							</p>
						</div>
					</section>

					<section className="space-y-7">
						<div className="flex items-baseline justify-between gap-6">
							<Eyebrow className="font-semibold">Writing</Eyebrow>
							<Link
								className="text-link font-ui text-sm text-muted-foreground"
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
										className="entry-link"
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

					<section className="space-y-10">
						<Eyebrow className="font-semibold">Capabilities</Eyebrow>
						<div className="space-y-12">
							{capabilities.map(cap => (
								<div className="space-y-5" key={cap.title}>
									<div>
										<h3 className="font-medium text-foreground">{cap.title}</h3>
										<p className="mt-1 text-base/6 text-muted-foreground">{cap.summary}</p>
									</div>
									{cap.items.length > 0 && (
										<div className="space-y-6">
											{cap.items.map(item => (
												item.link
													? (
															<a
																className="entry-link"
																href={item.link}
																key={`${cap.title}-${item.title}`}
																rel="noreferrer"
																target="_blank"
															>
																<h4 className="font-medium text-foreground">{item.title}</h4>
																<p className="mt-1 text-base/6 text-muted-foreground">{item.description}</p>
															</a>
														)
													: (
															<div className="space-y-1" key={`${cap.title}-${item.title}`}>
																<h4 className="font-medium text-foreground">{item.title}</h4>
																<p className="mt-1 text-base/6 text-muted-foreground">{item.description}</p>
															</div>
														)
											))}
										</div>
									)}
								</div>
							))}
						</div>
						<p className="text-base/6 text-muted-foreground">
							<Link className="text-link text-link-strong font-ui" to="/lab">
								Lab
							</Link>
							{' '}
							— AI UI experiments, motion studies, and small tools that do not belong in a case study.
						</p>
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
