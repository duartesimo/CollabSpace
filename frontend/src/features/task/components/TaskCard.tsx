import { Link } from 'react-router-dom'
import StatusBadge from '../../../components/ui/StatusBadge'
import UserIdentity from '../../../components/user/UserIdentity'
import type { Task, TaskStatus } from '../types/Task'

interface TaskCardProps {
	task: Task
}

const statusTone: Record<TaskStatus, 'slate' | 'amber' | 'emerald'> = {
	TODO: 'slate',
	IN_PROGRESS: 'amber',
	DONE: 'emerald'
}

const statusLabel: Record<TaskStatus, string> = {
	TODO: 'TODO',
	IN_PROGRESS: 'IN PROGRESS',
	DONE: 'DONE'
}

export default function TaskCard({ task }: TaskCardProps) {
	return (
		<Link
			to={`/tasks/${task.id}`}
			className="group flex min-h-56 flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-4 outline-none transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900/70 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/30"
		>
			<div className="flex items-start justify-between gap-3">
				<h3 className="line-clamp-2 font-semibold leading-6 text-white transition group-hover:text-indigo-200">{task.title}</h3>
				<StatusBadge tone={statusTone[task.status]} className="shrink-0">
					{statusLabel[task.status]}
				</StatusBadge>
			</div>
			<p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
				{task.description || 'No description provided for this task yet.'}
			</p>
			<div className="mt-auto border-t border-slate-800/80 pt-4">
				{task.assignee ? (
					<UserIdentity user={task.assignee} />
				) : (
					<div className="flex items-center gap-3">
						<span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-400">—</span>
						<span className="text-sm font-medium text-slate-400">Unassigned</span>
					</div>
				)}
				<p className="mt-3 text-xs text-slate-600">
					Created {new Date(task.createdAt).toLocaleDateString()}
				</p>
			</div>
		</Link>
	)
}
