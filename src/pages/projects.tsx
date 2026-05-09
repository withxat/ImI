import { Container } from '../components/ui/primitives'
import { getProjects } from '../lib/projects'

export default async function ProjectsPage() {
	const projects = getProjects()

	return (
		<section>
			<title>Project</title>
			<Container className="
				py-16
				md:py-28
			"
			>
				<div className="space-y-0">
					<p className="font-medium text-foreground">Projects</p>
					<p className="text-muted-foreground">Check out my creations below!</p>
				</div>

				<div className="
					mt-28 space-y-7
					md:mt-32
				"
				>
					{projects.map(project => (
						<a
							className="
								block transition-colors duration-150
								hover:text-black
							"
							href={project.link}
							key={project.id}
							rel="noreferrer"
							target="_blank"
						>
							<h2 className="font-medium text-foreground">{project.title}</h2>
							<p className="mt-1 text-base/6 text-muted-foreground">{project.description}</p>
						</a>
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
