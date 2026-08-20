export interface UserProfile {
	id: number
	username: string
	email: string
	createdAt: string
	displayName?: string
	avatarUrl?: string
}

export type UserIdentityData = Pick<UserProfile, 'username'> &
	Partial<Pick<UserProfile, 'id' | 'email' | 'displayName' | 'avatarUrl'>>
