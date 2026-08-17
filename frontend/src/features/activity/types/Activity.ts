export type ActivityType =
	| 'TASK_CREATED'
	| 'TASK_UPDATED'
	| 'TASK_STATUS_CHANGED'
	| 'TASK_ASSIGNED'
	| 'TASK_UNASSIGNED'
	| 'COMMENT_CREATED'

export interface ActivityUser {
	id: number
	username: string
	email: string
}

export interface Activity {
	id: number
	type: ActivityType
	description: string
	user: ActivityUser
	createdAt: string
}
