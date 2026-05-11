import { Link } from 'waku'

import { ConstructionStripesIcon } from '@/components/construction-stripes-icon'
import { HomeCardLink } from '@/components/home-card-link'
import { IntroBadgePopover } from '@/components/intro-badge-popover'
import { NameAudioButton } from '@/components/name-audio-button'
import { Reveal } from '@/components/reveal'
import { StaggerReveal } from '@/components/stagger-reveal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { getAllPosts } from '@/lib/blog'
import { getCapabilities } from '@/lib/projects'
import { Seo } from '@/lib/seo'
import { DEFAULT_DESCRIPTION, personJsonLd, websiteJsonLd } from '@/lib/seo-data'

export default async function HomePage() {
	const data = await getData()
	const posts = getAllPosts().slice(0, 4)
	const capabilities = getCapabilities()

	return (
		<section>
			<Seo
				canonicalPath="/"
				description={DEFAULT_DESCRIPTION}
				jsonLd={[personJsonLd(), websiteJsonLd()]}
				title={data.title}
				type="profile"
			/>
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
							<h1 className="
								inline-flex items-baseline gap-2 text-2xl tracking-tight text-foreground
								sm:text-3xl
							"
							>
								<span className="font-xat-name font-normal">Xat</span>
								<NameAudioButton />
							</h1>
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
										<HomeCardLink
											description={post.summary}
											href={`/post/${slug}`}
											title={post.title}
											prefetchOnView
										/>
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
															<HomeCardLink
																description={item.description}
																href={item.link}
																key={`${cap.title}-${item.title}`}
																title={item.title}
																external
															/>
														)
													: (
															<HomeCardLink
																description={item.description}
																key={`${cap.title}-${item.title}`}
																title={item.title}
															/>
														),
											)}
											{cap.items.length === 0 && (
												<HomeCardLink
													description={cap.emptyState?.description ?? 'Links when there is something worth flexing.'}
													title={cap.emptyState?.title ?? 'Work in progress'}
													trailingIcon={<ConstructionStripesIcon className="-mx-0.5 text-muted-foreground opacity-80" />}
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
		title: 'Xat - Design Engineer',
	}
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
