export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

export interface Project {
	id: number
	name: string
	description?: string
	status: ProjectStatus
	workspaceId: number
	createdAt: string
	updatedAt: string
}
