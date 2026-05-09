import type { PageProps } from 'waku/router'

import { ArticleBody } from '../../components/article-body'
import { Container, Eyebrow, TextLink } from '../../components/ui/primitives'
import { formatPostDate, getCategoryBySlug, getPostBySlug, getPostSlugs } from '../../lib/blog'

export default async function BlogPostPage({ slug }: PageProps<'/blog/[slug]'>) {
	const post = getPostBySlug(slug)

	if (!post) {
		throw new Error(`Post not found: ${slug}`)
	}

	const MDX = post.body
	const category = getCategoryBySlug(post.category)

	return (
		<section>
			<title>{post.title}</title>
			<Container className="
				py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-5">
					<TextLink to="/">Go to home</TextLink>
					<div className="space-y-3">
						<Eyebrow>
							{category ? `${category.name} - ${category.description}` : post.category}
						</Eyebrow>
						<h1 className="
							text-4xl font-semibold tracking-tight text-(--color-foreground)
							sm:text-5xl
						"
						>
							{post.title}
						</h1>
						<p className="text-base/7 text-muted-foreground">{post.summary}</p>
					</div>
					<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<span className="font-semibold text-(--color-foreground)">PROPERTIES</span>
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
