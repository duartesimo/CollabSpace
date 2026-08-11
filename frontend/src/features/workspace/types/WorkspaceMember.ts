export interface WorkspaceMember {
	userId: number
	username: string
	email: string
	role: 'OWNER' | 'MEMBER'
	joinedAt: string
}
