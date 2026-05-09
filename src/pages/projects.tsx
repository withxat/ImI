import { Container, Eyebrow, SurfacePanel } from '../components/ui/primitives'
import { getProjects } from '../lib/projects'

export default async function ProjectsPage() {
	const projects = getProjects()

	return (
		<section>
			<title>Project</title>
			<Container className="
				py-10
				md:py-14
			"
			>
				<div className="mb-10 space-y-4">
					<Eyebrow>Project</Eyebrow>
					<h1 className="
						text-4xl font-semibold tracking-tight text-(--color-foreground)
						sm:text-5xl
					"
					>
						Project
					</h1>
					<p className="text-base/7 text-muted-foreground">
						Check out my creations below!
					</p>
				</div>

				<div className="grid gap-3">
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
