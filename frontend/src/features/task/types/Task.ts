export interface Task {
	id: number
	projectId: number
	title: string
	description?: string
	status: 'TODO' | 'IN_PROGRESS' | 'DONE'
	createdAt: string
	updatedAt: string
}
