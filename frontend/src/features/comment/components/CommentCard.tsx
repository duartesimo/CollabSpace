import UserIdentity from '../../../components/user/UserIdentity'
import type { Comment } from '../types/Comment'

interface CommentCardProps {
	comment: Comment
	onDelete?: () => void
	isDeleting?: boolean
}

export default function CommentCard({ comment, onDelete, isDeleting = false }: CommentCardProps) {
	return (
		<div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<UserIdentity user={comment.author} />
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						disabled={isDeleting}
						className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				)}
			</div>
			<p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{comment.content}</p>
			<p className="mt-4 text-xs text-slate-500">
				Created {new Date(comment.createdAt).toLocaleDateString()}
			</p>
		</div>
	)
}
