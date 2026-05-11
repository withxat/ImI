import { Link } from 'waku'

import { Reveal } from '@/components/reveal'
import { StaggerReveal } from '@/components/stagger-reveal'
import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { getPostsByCategory } from '@/lib/blog'
import { cn } from '@/lib/cn'
import { getMessages } from '@/lib/i18n/messages'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { Seo } from '@/lib/seo'

export default async function BlogIndexPage() {
	const locale = getRequestLocale()
	const m = getMessages(locale)
	const groups = getPostsByCategory().map((group) => {
		const cat = m.categories[group.category.slug as keyof typeof m.categories]
		return {
			category: cat
				? { ...group.category, description: cat.description, name: cat.name }
				: group.category,
			posts: group.posts,
		}
	})

	return (
		<section>
			<Seo
				canonicalPath="/post"
				description={m.blog.pageDescription}
				title={m.blog.pageTitle}
			/>
			<Container className="page-shell">
				<StaggerReveal className="flex flex-col">
					<div className="space-y-8">
						<TextLink to="/">{m.blog.goHome}</TextLink>
						<div className="space-y-0">
							<h1 className="font-medium text-foreground">{m.blog.title}</h1>
							<p className="text-muted-foreground">{m.blog.archiveSubtitle}</p>
						</div>
					</div>

					{groups.map((group, index) => (
						<section
							className={cn(
								'space-y-7',
								index === 0
									? `
										mt-28
										md:mt-32
									`
									: 'mt-20',
							)}
							key={group.category.slug}
						>
							<Reveal staggerIndex={0}>
								<div>
									<Eyebrow>{group.category.name}</Eyebrow>
									<p className="mt-1 text-base/6 text-muted-foreground">{group.category.description}</p>
								</div>
							</Reveal>

							<div className="space-y-6">
								{group.posts.map((post, postIndex) => {
									const slug = post.slug

									return (
										<Reveal key={slug} staggerIndex={postIndex + 1}>
											<Link
												className="entry-link"
												to={`/post/${slug}`}
												unstable_prefetchOnView
											>
												<h3 className="font-medium text-foreground">{post.title}</h3>
												<p className="mt-1 text-base/6 text-muted-foreground">{post.summary}</p>
											</Link>
										</Reveal>
									)
								})}
							</div>
						</section>
					))}
				</StaggerReveal>
			</Container>
		</section>
	)
}

export async function getConfig() {
	return {
		render: 'dynamic',
	} as const
}
