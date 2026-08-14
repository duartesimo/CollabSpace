export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
	id: number
	projectId: number
	title: string
	description?: string
	status: TaskStatus
	createdAt: string
	updatedAt: string
}
