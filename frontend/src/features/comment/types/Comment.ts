export interface CommentAuthor {
	id: number
	username: string
	email: string
}

export interface Comment {
	id: number
	content: string
	author: CommentAuthor
	createdAt: string
	updatedAt: string
}
