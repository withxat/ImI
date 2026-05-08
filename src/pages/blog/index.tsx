import { Container, Eyebrow, SurfacePanel, TextLink } from '../../components/ui/primitives'
import { formatPostDate, getPostsByCategory } from '../../lib/blog'

export default async function BlogIndexPage() {
	const groups = getPostsByCategory()

	return (
		<section>
			<title>Blog</title>
			<Container className="
				max-w-5xl py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-4">
					<Eyebrow>Writing</Eyebrow>
					<h1 className="
						max-w-3xl text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
					"
					>
						旧内容先优雅落位，文章本身继续发光。
					</h1>
					<p className="max-w-2xl text-base/7 text-muted-foreground">
						这里先迁入原来 Astro content collection 里的文章内容，只保留清爽的归档和阅读体验。
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
											<div className="
												space-y-3 p-5
												sm:p-6
											"
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
												<TextLink to={`/blog/${slug}`}>Read article</TextLink>
											</div>
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
