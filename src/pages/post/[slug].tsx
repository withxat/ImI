import type { PageProps } from 'waku/router'

import { ArticleBody } from '@/components/article-body'
import { StaggerReveal } from '@/components/stagger-reveal'
import { Badge } from '@/components/ui/badge'
import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { Separator } from '@/components/ui/separator'
import { formatPostDate, getCategoryBySlug, getPostBySlug } from '@/lib/blog'
import { getMessages } from '@/lib/i18n/messages'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { Seo } from '@/lib/seo'
import { blogPostingJsonLd } from '@/lib/seo-data'

export default async function BlogPostPage({ slug }: PageProps<'/post/[slug]'>) {
	const locale = getRequestLocale()
	const m = getMessages(locale)
	const post = getPostBySlug(slug)

	if (!post) {
		throw new Error(`Post not found: ${slug}`)
	}

	const category = getCategoryBySlug(post.category)
	const localizedCategory = category
		? m.categories[category.slug as keyof typeof m.categories]
		: undefined
	const categoryEyebrow = localizedCategory
		? `${localizedCategory.name} - ${localizedCategory.description}`
		: post.category

	const canonicalPath = `/post/${post.slug}`

	return (
		<section>
			<Seo
				jsonLd={blogPostingJsonLd({
					canonicalPath,
					date: post.date,
					description: post.summary,
					tags: post.tags,
					title: post.title,
				})}
				canonicalPath={canonicalPath}
				description={post.summary}
				title={`${post.title} - Xat`}
				type="article"
			/>
			<Container className="page-shell">
				<StaggerReveal className="flex flex-col">
					<div className="mb-20 space-y-8">
						<TextLink to="/">{m.blog.goHome}</TextLink>
						<div className="space-y-3">
							<Eyebrow>
								{categoryEyebrow}
							</Eyebrow>
							<h1 className="text-3xl font-medium text-foreground">{post.title}</h1>
							<p className="text-base/7 text-muted-foreground">{post.summary}</p>
						</div>
						<div className="flex flex-wrap items-center gap-3 font-ui text-sm text-muted-foreground">
							<span>{formatPostDate(post.date, locale)}</span>
							<Separator className="h-4" orientation="vertical" />
							<div className="flex flex-wrap gap-2">
								{post.tags.map(tag => (
									<Badge key={tag} size="sm" variant="outline">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					</div>

					<ArticleBody mdx={post.mdx} />
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
