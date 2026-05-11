import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'waku'

import { CapabilityEmptyPlaceholder } from '@/components/capability-empty-placeholder'
import { CapabilityExternalLink } from '@/components/capability-external-link'
import { IntroBadgePopover } from '@/components/intro-badge-popover'
import { NameAudioButton } from '@/components/name-audio-button'
import { Reveal } from '@/components/reveal'
import { StaggerReveal } from '@/components/stagger-reveal'
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
				<StaggerReveal className="flex flex-col">
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
								inline-flex items-baseline gap-2 text-2xl tracking-tight text-foreground
								sm:text-3xl
							"
							>
								<span className="font-xat-name font-normal">Xat</span>
								<NameAudioButton />
							</p>
							<p className="text-muted-foreground">Design Engineer</p>
							<p className="mt-3 max-w-prose font-serif text-base/7 text-foreground">
								Building production-quality interfaces and AI-native products
							</p>
						</div>
					</div>

					<section className="
						mt-28
						md:mt-32
					"
					>
						<StaggerReveal className="space-y-1.5" delayChildren={0.03} staggerChildren={0.045}>
							<p className="text-base/7 text-muted-foreground">
								I design and ship applied AI interfaces, workflows, and developer tools.
							</p>
							<p className="text-base/7 text-muted-foreground">
								A
								{' '}
								<IntroBadgePopover kind="systems" />
								{' '}
								taught me to balance design intent, engineering constraints, and the messy
								realities of building
								{' '}
								<IntroBadgePopover kind="products" />
								.
							</p>
						</StaggerReveal>
					</section>

					<section className="mt-28 space-y-7">
						<Reveal staggerIndex={0}>
							<div className="flex items-baseline justify-between gap-6">
								<Eyebrow className="font-semibold">Writing</Eyebrow>
								<Link
									className="text-link font-ui text-sm text-muted-foreground"
									to="/post"
								>
									View All
								</Link>
							</div>
						</Reveal>
						<div className="space-y-3">
							{posts.map((post, index) => {
								const slug = post.slug

								return (
									<Reveal key={slug} staggerIndex={index + 1}>
										<Link
											className="
												group flex items-center justify-start gap-3 rounded-xl border border-input bg-popover px-4
												py-3.5 text-left font-normal shadow-xs/5 transition-colors
												not-dark:bg-clip-padding
												hover:bg-accent/50 hover:text-foreground
												dark:bg-input/32
												dark:hover:bg-input/64
											"
											to={`/post/${slug}`}
											unstable_prefetchOnView
										>
											<span className="min-w-0 flex-1 space-y-1">
												<span className="block text-sm font-medium text-foreground">{post.title}</span>
												<span className="block truncate text-sm text-muted-foreground">{post.summary}</span>
											</span>
											<ArrowRightIcon
												className="
													-mx-0.5 size-4 text-muted-foreground opacity-80 transition-transform duration-150 ease-out
													group-hover:translate-x-0.5 group-hover:text-foreground
												"
												aria-hidden="true"
											/>
										</Link>
									</Reveal>
								)
							})}
						</div>
					</section>

					<section className="mt-28 space-y-10">
						<Reveal staggerIndex={0}>
							<Eyebrow className="font-semibold">Capabilities</Eyebrow>
						</Reveal>
						<div className="space-y-12">
							{capabilities.map((cap, index) => (
								<Reveal key={cap.title} staggerIndex={index + 1}>
									<div className="space-y-5">
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
								</Reveal>
							))}
						</div>
					</section>
				</StaggerReveal>
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
