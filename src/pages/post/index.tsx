import { Link } from 'waku'

import { Container, Eyebrow, TextLink } from '@/components/ui/primitives'
import { getPostsByCategory } from '@/lib/blog'

export default async function BlogIndexPage() {
	const groups = getPostsByCategory()

	return (
		<section>
			<title>All Writings</title>
			<Container className="page-shell">
				<div className="space-y-8">
					<TextLink to="/">Go to home</TextLink>
					<div className="space-y-0">
						<p className="font-medium text-foreground">All Writings</p>
						<p className="text-muted-foreground">Archive - Texts just sparkle in my mind</p>
					</div>
				</div>

				<div className="archive-sections">
					{groups.map(group => (
						<section className="space-y-7" key={group.category.slug}>
							<div>
								<Eyebrow>{group.category.name}</Eyebrow>
								<p className="mt-1 text-base/6 text-muted-foreground">{group.category.description}</p>
							</div>

							<div className="space-y-6">
								{group.posts.map((post) => {
									const slug = post.slug

									return (
										<Link
											className="entry-link"
											key={slug}
											to={`/post/${slug}`}
										>
											<h3 className="font-medium text-foreground">{post.title}</h3>
											<p className="mt-1 text-base/6 text-muted-foreground">{post.summary}</p>
										</Link>
									)
								})}
							</div>
						</section>
					))}
				</div>
			</Container>
		</section>
	)
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
