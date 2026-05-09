import projects from '../../content/projects.json'

export interface Project {
	description: string
	id: string
	link: string
	title: string
}

export function getProjects() {
	return projects satisfies Project[]
}
