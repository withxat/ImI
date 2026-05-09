import { Container, Eyebrow, SurfacePanel } from '../components/ui/primitives'
import { getProjects } from '../lib/projects'

export default async function ProjectsPage() {
	const projects = getProjects()

	return (
		<section>
			<title>Projects</title>
			<Container className="
				max-w-5xl py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-4">
					<Eyebrow>Projects</Eyebrow>
					<h1 className="
						max-w-3xl text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
					"
					>
						一些小而真实的工程痕迹。
					</h1>
					<p className="max-w-2xl text-base/7 text-muted-foreground">
						先迁入旧站的项目列表内容，保留每个项目最原始的标题、说明和外部链接。
					</p>
				</div>

				<div className="
					grid gap-3
					sm:grid-cols-2
				"
				>
					{projects.map(project => (
						<SurfacePanel
							className="
								transition-transform duration-150
								hover:-translate-y-0.5
							"
							key={project.id}
						>
							<a
								className="
									block h-full space-y-4 p-5
									sm:p-6
								"
								href={project.link}
								rel="noreferrer"
								target="_blank"
							>
								<div className="space-y-2">
									<h2 className="text-xl font-semibold tracking-tight text-(--color-foreground)">
										{project.title}
									</h2>
									<p className="text-sm/6 text-muted-foreground">{project.description}</p>
								</div>
								<p className="text-sm font-medium text-(--color-foreground) underline decoration-border underline-offset-4">
									View project
								</p>
							</a>
						</SurfacePanel>
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
