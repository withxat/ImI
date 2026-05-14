import { ArrowUpRightIcon } from 'lucide-react'
import { Link } from 'waku'

import { ConstructionStripesIcon } from '@/components/construction-stripes-icon'
import { HomeCardLink } from '@/components/home-card-link'
import { IntroBadgePopover } from '@/components/intro-badge-popover'
import { NameAudioButton } from '@/components/name-audio-button'
import { Reveal } from '@/components/reveal'
import { SiteHeader } from '@/components/site-header'
import { StaggerReveal } from '@/components/stagger-reveal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { getAllPosts } from '@/lib/blog'
import { htmlLangFor } from '@/lib/i18n/constants'
import { getIntroBadgeCopy } from '@/lib/i18n/intro-badges'
import { getMessages } from '@/lib/i18n/messages'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { getCapabilities } from '@/lib/projects'
import { Seo } from '@/lib/seo'
import { personJsonLd, PROFILE_AVATAR_SRC, websiteJsonLd } from '@/lib/seo-data'

export default async function HomePage() {
	const locale = getRequestLocale()
	const m = getMessages(locale)
	const systemsCopy = getIntroBadgeCopy(locale, 'systems')
	const productsCopy = getIntroBadgeCopy(locale, 'products')
	const posts = getAllPosts(locale).slice(0, 4)
	const baseCapabilities = getCapabilities()
	const capabilities = mergeCapabilityCopy(baseCapabilities, m)
	const featuredCapability = capabilities[0]
	const featuredProject = featuredCapability?.items[0]

	return (
		<section>
			<Seo
				jsonLd={[
					personJsonLd({ description: m.home.metaDescription }),
					websiteJsonLd({ description: m.home.metaDescription }),
				]}
				canonicalPath="/"
				description={m.home.metaDescription}
				locale={locale}
				title={m.home.title}
				type="profile"
			>
				<link as="font" crossOrigin="anonymous" href="/fonts/fugaz-one-regular-subset.woff2" rel="preload" type="font/woff2" />
				<link as="image" href={PROFILE_AVATAR_SRC} rel="preload" />
			</Seo>
			<Container className="page-shell">
				<div className="flex flex-col">
					<div className="flex flex-col gap-4">
						<SiteHeader locale={locale} messages={m} />
						<div className="flex min-w-0 flex-col gap-4">
							<Avatar className="
								size-14 rounded-xl border border-border
								sm:size-16
							"
							>
								<AvatarImage
									alt="Xat"
									fetchPriority="high"
									height={64}
									referrerPolicy="no-referrer"
									src={PROFILE_AVATAR_SRC}
									width={64}
								/>
								<AvatarFallback className="rounded-xl text-sm">Xat</AvatarFallback>
							</Avatar>
							<div className="space-y-0">
								<h1 className="
									inline-flex items-baseline gap-2 text-2xl tracking-tight text-foreground
									sm:text-3xl
								"
								>
									<span className="font-fugaz-one font-normal text-highlight-strong">Xat</span>
									<NameAudioButton />
								</h1>
								<p className="text-muted-foreground">{m.home.role}</p>
							</div>
						</div>
						<p
							className="home-bio-lead max-w-prose font-serif text-base/7 font-semibold text-foreground"
							lang={htmlLangFor(locale)}
						>
							{m.home.bioLead}
						</p>
					</div>

					<section className="
						mt-28
						md:mt-32
					"
					>
						<StaggerReveal className="space-y-1.5" delayChildren={0.03} staggerChildren={0.045}>
							<p className="text-base/7 text-muted-foreground">
								{m.home.bioP1}
							</p>
							<p className="text-base/7 text-muted-foreground">
								{m.home.introBeforeSystems}
								<IntroBadgePopover
									description={systemsCopy.description}
									kind="systems"
									label={systemsCopy.label}
								/>
								{m.home.introBetweenBadges}
								<IntroBadgePopover
									description={productsCopy.description}
									kind="products"
									label={productsCopy.label}
								/>
								{m.home.introAfterProducts}
							</p>
						</StaggerReveal>
					</section>

					{featuredProject?.link && (
						<section className="
							mt-20 border-y border-border py-7
							md:mt-24 md:py-8
						"
						>
							<Reveal staggerIndex={0}>
								<div className="
									grid gap-5
									sm:grid-cols-[10rem_1fr]
								"
								>
									<Eyebrow className="text-sm text-muted-foreground">{m.home.proofEyebrow}</Eyebrow>
									<div className="space-y-4">
										<div className="space-y-1.5">
											<p className="text-lg/6 font-semibold text-foreground">{m.home.proofTitle}</p>
											<p className="max-w-prose text-base/7 text-muted-foreground">{m.home.proofDescription}</p>
										</div>
										<a
											className="group inline-flex items-center gap-2 font-ui text-sm font-medium text-highlight-strong"
											href={featuredProject.link}
											rel="noreferrer"
											target="_blank"
										>
											{m.home.proofCta}
											<ArrowUpRightIcon
												className="
													size-4 text-highlight-icon transition-transform duration-150 ease-out
													group-hover:translate-x-0.5 group-hover:-translate-y-0.5
												"
												aria-hidden="true"
											/>
										</a>
									</div>
								</div>
							</Reveal>
						</section>
					)}

					<section className="mt-24 space-y-7">
						<Reveal staggerIndex={0}>
							<div className="flex items-baseline justify-between gap-6">
								<Eyebrow className="font-semibold">{m.home.writingEyebrow}</Eyebrow>
								<Link
									className="text-link font-ui text-sm"
									to="/post"
								>
									{m.home.viewAllPosts}
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
							<Eyebrow className="font-semibold">{m.home.capabilitiesEyebrow}</Eyebrow>
						</Reveal>
						<div className="space-y-14">
							{capabilities.map((cap, index) => (
								<Reveal
									key={baseCapabilities[index]?.title ?? cap.title}
									staggerIndex={index + 1}
								>
									<div className="
										grid gap-4 border-t border-border pt-5
										sm:grid-cols-[3rem_1fr]
									"
									>
										<p className="font-mono text-xs/6 text-muted-foreground">
											{String(index + 1).padStart(2, '0')}
										</p>
										<div className="min-w-0 space-y-4">
											<div>
												<h3 className="text-base/6 font-semibold text-foreground">{cap.title}</h3>
												<p className="mt-1 text-base/7 text-muted-foreground">{cap.summary}</p>
											</div>
											<ul className="space-y-2">
												{cap.items.map(item => (
													<li key={`${cap.title}-${item.title}`}>
														{item.link
															? (
																	<a
																		className="group inline-flex max-w-full items-baseline gap-2 text-sm/6 text-foreground"
																		href={item.link}
																		rel="noreferrer"
																		target="_blank"
																	>
																		<span className="
																			font-medium transition-colors
																			group-hover:text-highlight-strong
																		"
																		>
																			{item.title}
																		</span>
																		<span className="min-w-0 truncate text-muted-foreground">{item.description}</span>
																		<ArrowUpRightIcon
																			className="
																				size-3.5 shrink-0 self-center text-muted-foreground transition-transform duration-150 ease-out
																				group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-highlight-icon
																			"
																			aria-hidden="true"
																		/>
																	</a>
																)
															: (
																	<div className="inline-flex max-w-full items-baseline gap-2 text-sm/6">
																		<span className="font-medium text-foreground">{item.title}</span>
																		<span className="min-w-0 truncate text-muted-foreground">{item.description}</span>
																	</div>
																)}
													</li>
												))}
												{cap.items.length === 0 && (
													<li className="inline-flex max-w-full items-baseline gap-2 text-sm/6">
														<span className="font-medium text-foreground">
															{cap.emptyState?.title ?? m.home.emptyCapabilityTitle}
														</span>
														<span className="min-w-0 truncate text-muted-foreground">
															{cap.emptyState?.description ?? m.home.emptyCapabilityDescription}
														</span>
														<ConstructionStripesIcon className="size-4 shrink-0 self-center text-muted-foreground opacity-80" />
													</li>
												)}
											</ul>
										</div>
									</div>
								</Reveal>
							))}
						</div>
					</section>
				</div>
			</Container>
		</section>
	)
}

function mergeCapabilityCopy(
	capabilities: ReturnType<typeof getCapabilities>,
	m: ReturnType<typeof getMessages>,
) {
	return capabilities.map((cap, i) => {
		const copy = m.capabilities[i]
		if (!copy) {
			return cap
		}

		return {
			...cap,
			emptyState: copy.emptyState ?? cap.emptyState,
			items: cap.items.map((item, j) => ({
				...item,
				description: copy.items[j]?.description ?? item.description,
				title: copy.items[j]?.title ?? item.title,
			})),
			summary: copy.summary,
			title: copy.title,
		}
	})
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
