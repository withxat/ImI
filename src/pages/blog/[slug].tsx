import type { PageProps } from 'waku/router'

import { ArticleBody } from '../../components/article-body'
import { Container, Eyebrow, TextLink } from '../../components/ui/primitives'
import { BLOG_CATEGORIES, formatPostDate, getPostBySlug, getPostSlugs } from '../../lib/blog'

export default async function BlogPostPage({ slug }: PageProps<'/blog/[slug]'>) {
	const post = getPostBySlug(slug)

	if (!post) {
		throw new Error(`Post not found: ${slug}`)
	}

	const MDX = post.body
	const category = BLOG_CATEGORIES[post.category as keyof typeof BLOG_CATEGORIES]

	return (
		<section>
			<title>{post.title}</title>
			<Container className="
				max-w-3xl py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-5">
					<TextLink to="/blog">Back to blog</TextLink>
					<div className="space-y-3">
						<Eyebrow>{category?.name ?? post.category}</Eyebrow>
						<h1 className="
							text-4xl font-semibold tracking-tight text-(--color-foreground)
							sm:text-5xl
						"
						>
							{post.title}
						</h1>
						<p className="max-w-2xl text-base/7 text-muted-foreground">{post.summary}</p>
					</div>
					<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<span>{formatPostDate(post.date)}</span>
						<span className="text-border">/</span>
						<div className="flex flex-wrap gap-2">
							{post.tags.map(tag => (
								<span className="rounded-full border bg-surface px-2.5 py-1 text-xs font-medium" key={tag}>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>

				<ArticleBody MDX={MDX} />
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
