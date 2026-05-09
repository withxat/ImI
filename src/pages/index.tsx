import { Link } from 'waku'

import { CapabilityEmptyPlaceholder } from '@/components/capability-empty-placeholder'
import { CapabilityExternalLink } from '@/components/capability-external-link'
import { NameAudioButton } from '@/components/name-audio-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
				<div className="flex flex-col gap-4">
					<Avatar className="
						size-14 rounded-xl border border-border
						sm:size-16
					"
					>
						<AvatarImage
							alt="Xat"
							referrerPolicy="no-referrer"
							src="https://github.com/withxat.png"
						/>
						<AvatarFallback className="rounded-xl text-sm">Xat</AvatarFallback>
					</Avatar>
					<div className="space-y-0">
						<p className="
							text-2xl font-medium tracking-tight text-foreground
							sm:text-3xl
						"
						>
							Xat
							<NameAudioButton />
						</p>
						<p className="text-muted-foreground">Design Engineer</p>
						<p className="mt-3 max-w-prose font-serif text-base/7 text-foreground">
							Building production-quality interfaces and AI-native products
						</p>
					</div>
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
						<div>
							{posts.map((post) => {
								const slug = post.slug

								return (
									<Link
										className="post-list-entry entry-link"
										key={slug}
										to={`/post/${slug}`}
									>
										<h3 className="text-sm font-medium text-foreground">{post.title}</h3>
										<p className="mt-1 text-sm/6 text-muted-foreground">{post.summary}</p>
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
									<div className="space-y-3">
										{cap.items.map(item =>
											item.link
												? (
														<CapabilityExternalLink
															description={item.description}
															href={item.link}
															key={`${cap.title}-${item.title}`}
															title={item.title}
														/>
													)
												: (
														<div className="space-y-1" key={`${cap.title}-${item.title}`}>
															<h4 className="font-medium text-foreground">{item.title}</h4>
															<p className="truncate text-base/6 text-muted-foreground">{item.description}</p>
														</div>
													),
										)}
										{cap.items.length === 0 && (
											<CapabilityEmptyPlaceholder
												description={cap.emptyState?.description ?? 'Links when there is something worth flexing.'}
												title={cap.emptyState?.title ?? 'Work in progress'}
											/>
										)}
									</div>
								</div>
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
