import { Link } from 'waku'

import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react'
import { HomeCardLink } from '@/components/home-card-link'
import { IntroBadgePopover } from '@/components/intro-badge-popover'
import { NameAudioButton } from '@/components/name-audio-button'
import { Reveal } from '@/components/reveal'
import { SiteHeader } from '@/components/site-header'
import { StaggerReveal } from '@/components/stagger-reveal'
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
							<img
								className="
									size-14 rounded-xl border border-border object-cover
									sm:size-16
								"
								alt="Xat"
								fetchPriority="high"
								height={64}
								referrerPolicy="no-referrer"
								src={PROFILE_AVATAR_SRC}
								width={64}
							/>
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

					<section className="mt-28 space-y-8">
						<Reveal staggerIndex={0}>
							<div className="
								grid gap-3
								sm:grid-cols-[10rem_1fr]
							"
							>
								<Eyebrow className="font-semibold">{m.home.capabilitiesEyebrow}</Eyebrow>
								<p className="max-w-prose text-base/7 text-muted-foreground">
									{m.home.capabilitiesIntro}
								</p>
							</div>
						</Reveal>
						<div className="space-y-10">
							{capabilities.map((cap, index) => (
								<Reveal
									key={baseCapabilities[index]?.title ?? cap.title}
									staggerIndex={index + 1}
								>
									<article className="
										grid gap-3
										sm:grid-cols-[3.25rem_1fr_15rem] sm:gap-6
									"
									>
										<p className="font-mono text-xs/6 text-muted-foreground">
											{String(index + 1).padStart(2, '0')}
										</p>
										<div className="min-w-0">
											<div className="max-w-prose">
												<h3 className="text-lg/6 font-semibold tracking-tight text-foreground">{cap.title}</h3>
												<p className="mt-1 text-base/7 text-muted-foreground">{cap.summary}</p>
											</div>
										</div>
										<div className="
											min-w-0 space-y-2
											sm:pt-0.5
										"
										>
											{cap.items.map(item => (
												<CapabilityProofLink
													description={item.description}
													href={item.link}
													key={`${cap.title}-${item.title}`}
													title={item.title}
												/>
											))}
											{cap.items.length === 0 && (
												<CapabilityProofLink
													description={cap.emptyState?.description ?? m.home.emptyCapabilityDescription}
													title={cap.emptyState?.title ?? m.home.emptyCapabilityTitle}
												/>
											)}
										</div>
									</article>
								</Reveal>
							))}
						</div>
					</section>
				</div>
			</Container>
		</section>
	)
}

function CapabilityProofLink({
	description,
	href,
	title,
}: {
	description: string
	href?: string
	title: string
}) {
	const content = (
		<>
			<span className="min-w-0 space-y-1">
				<span className="
					block text-sm/5 font-medium text-foreground transition-colors
					group-hover/proof:text-highlight-strong
				"
				>
					{title}
				</span>
				<span className="block truncate text-sm/5 text-muted-foreground" title={description}>{description}</span>
			</span>
			{href && (
				<ArrowUpRightIcon
					className="
						mb-[3px] size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ease-out
						group-hover/proof:translate-x-0.5 group-hover/proof:-translate-y-0.5 group-hover/proof:text-highlight-icon
					"
					aria-hidden="true"
				/>
			)}
		</>
	)
	const className = `group/proof flex min-w-0 items-end justify-between gap-3 text-left`

	if (!href) {
		return <div className={className}>{content}</div>
	}

	return (
		<a
			className={className}
			href={href}
			rel="noreferrer"
			target="_blank"
		>
			{content}
		</a>
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
