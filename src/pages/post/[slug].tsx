import type { PageProps } from 'waku/router'

import { ArticleBody } from '@/components/article-body'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { PostTranslatedNoticeAside } from '@/components/post-translated-notice'
import { StaggerReveal } from '@/components/stagger-reveal'
import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { formatPostDate, getCategoryBySlug, getPostBySlug } from '@/lib/blog'
import { getMessages } from '@/lib/i18n/messages'
import { getRequestLocale } from '@/lib/i18n/request-locale'
import { Seo } from '@/lib/seo'
import { articleBreadcrumbJsonLd, blogPostingJsonLd, SITE_NAME } from '@/lib/seo-data'

export default async function BlogPostPage({ slug }: PageProps<'/post/[slug]'>) {
	const locale = getRequestLocale()
	const m = getMessages(locale)
	const post = getPostBySlug(slug, locale)

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
	const articleSection = localizedCategory?.name

	return (
		<section>
			<Seo
				jsonLd={[
					blogPostingJsonLd({
						articleSection,
						canonicalPath,
						date: post.date,
						description: post.summary,
						locale,
						tags: post.tags,
						title: post.title,
					}),
					articleBreadcrumbJsonLd([
						{ name: SITE_NAME, path: '/' },
						{ name: m.blog.title, path: '/post' },
						{ name: post.title, path: canonicalPath },
					]),
				]}
				canonicalPath={canonicalPath}
				description={post.summary}
				locale={locale}
				title={`${post.title} - Xat`}
				type="article"
			/>
			<Container className="page-shell">
				<StaggerReveal className="flex flex-col">
					<div className="mb-20 space-y-8">
						<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
							<TextLink to="/">{m.blog.goHome}</TextLink>
							<LocaleSwitcher
								aria-label={m.localeSwitcher.ariaLabel}
								currentLocale={locale}
							/>
						</div>
						<div className="space-y-3">
							<Eyebrow>
								{categoryEyebrow}
							</Eyebrow>
							<h1 className="text-3xl font-medium text-foreground">{post.title}</h1>
							<p className="text-base/7 text-muted-foreground">{post.summary}</p>
						</div>
						<div className="font-ui text-sm text-muted-foreground">
							<span>{formatPostDate(post.date, locale)}</span>
						</div>
					</div>

					{m.blog.postTranslatedNotice && (
						<PostTranslatedNoticeAside notice={m.blog.postTranslatedNotice} />
					)}

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
