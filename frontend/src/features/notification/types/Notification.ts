export type NotificationType = 'TASK_ASSIGNED' | 'COMMENT_CREATED' | 'TASK_STATUS_CHANGED'

export interface Notification {
	id: number
	type: NotificationType
	title: string
	message: string
	read: boolean
	createdAt: string
}
