import { Link } from 'waku'

import { Container, Eyebrow, SurfacePanel } from '../../components/ui/primitives'
import { formatPostDate, getPostsByCategory } from '../../lib/blog'

export default async function BlogIndexPage() {
	const groups = getPostsByCategory()

	return (
		<section>
			<title>All Writings</title>
			<Container className="
				py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-4">
					<Eyebrow>Archive - Texts just sparkle in my mind</Eyebrow>
					<h1 className="
						text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
					"
					>
						All Writings
					</h1>
					<p className="text-base/7 text-muted-foreground">
						All writings written by Xat
					</p>
				</div>

				<div className="space-y-8">
					{groups.map(group => (
						<section key={group.category.slug}>
							<div className="mb-3 flex items-end justify-between gap-4">
								<div>
									<h2 className="text-xl font-semibold tracking-tight text-(--color-foreground)">
										{group.category.name}
									</h2>
									<p className="text-sm text-muted-foreground">{group.category.description}</p>
								</div>
							</div>

							<div className="space-y-3">
								{group.posts.map((post) => {
									const slug = post.info.path.replace(/\.mdx?$/, '')

									return (
										<SurfacePanel
											className="
												transition-transform duration-150
												hover:-translate-y-0.5
											"
											key={slug}
										>
											<Link
												className="
													block space-y-3 p-5
													sm:p-6
												"
												to={`/blog/${slug}`}
											>
												<p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
													{formatPostDate(post.date)}
												</p>
												<div className="space-y-2">
													<h3 className="text-xl font-semibold tracking-tight text-(--color-foreground)">
														{post.title}
													</h3>
													<p className="text-sm/6 text-muted-foreground">{post.summary}</p>
												</div>
											</Link>
										</SurfacePanel>
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
