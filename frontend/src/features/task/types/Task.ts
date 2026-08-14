export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface TaskAssignee {
	id: number
	username: string
	email: string
}

export interface Task {
	id: number
	projectId: number
	title: string
	description?: string
	status: TaskStatus
	assignee?: TaskAssignee
	createdAt: string
	updatedAt: string
}
