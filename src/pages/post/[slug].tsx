import type { PageProps } from 'waku/router'

import { ArticleBody } from '@/components/article-body'
import { Badge } from '@/components/ui/badge'
import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { Separator } from '@/components/ui/separator'
import { formatPostDate, getCategoryBySlug, getPostBySlug, getPostSlugs } from '@/lib/blog'

export default async function BlogPostPage({ slug }: PageProps<'/post/[slug]'>) {
	const post = getPostBySlug(slug)

	if (!post) {
		throw new Error(`Post not found: ${slug}`)
	}

	const category = getCategoryBySlug(post.category)

	return (
		<section>
			<title>{post.title}</title>
			<Container className="page-shell">
				<div className="mb-20 space-y-8">
					<TextLink to="/">Go to home</TextLink>
					<div className="space-y-3">
						<Eyebrow>
							{category ? `${category.name} - ${category.description}` : post.category}
						</Eyebrow>
						<h1 className="text-3xl font-medium text-foreground">{post.title}</h1>
						<p className="text-base/7 text-muted-foreground">{post.summary}</p>
					</div>
					<div className="flex flex-wrap items-center gap-3 font-ui text-sm text-muted-foreground">
						<span>{formatPostDate(post.date)}</span>
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
			</Container>
		</section>
	)
}

export async function getConfig() {
	return {
		render: 'static',
		staticPaths: getPostSlugs(),
	} as const
}
