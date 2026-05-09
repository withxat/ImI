import type { PageProps } from 'waku/router'

import { ArticleBody } from '@/components/article-body'
import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { formatPostDate, getCategoryBySlug, getPostBySlug, getPostSlugs } from '@/lib/blog'

export default async function BlogPostPage({ slug }: PageProps<'/post/[slug]'>) {
	const post = getPostBySlug(slug)

	if (!post) {
		throw new Error(`Post not found: ${slug}`)
	}

	const MDX = post.mdx
	const category = getCategoryBySlug(post.category)

	return (
		<section>
			<title>{post.title}</title>
			<Container className="
				py-16
				md:py-28
			"
			>
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
						<span>/</span>
						<div className="flex flex-wrap gap-2">
							{post.tags.map(tag => (
								<span key={tag}>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>

				<ArticleBody content={MDX} />
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
