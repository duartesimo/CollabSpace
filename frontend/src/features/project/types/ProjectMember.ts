export interface ProjectMember {
	userId: number
	username: string
	email: string
	role: 'OWNER' | 'MEMBER'
	joinedAt: string
}
