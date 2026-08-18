import { Link } from 'react-router-dom'
import StatusBadge from '../../../components/ui/StatusBadge'
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
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
						{task.assignee ? task.assignee.username.trim().charAt(0).toUpperCase() || '?' : '—'}
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-slate-300">
							{task.assignee?.username || 'Unassigned'}
						</p>
						{task.assignee && <p className="truncate text-xs text-slate-500">{task.assignee.email}</p>}
					</div>
				</div>
				<p className="mt-3 text-xs text-slate-600">
					Created {new Date(task.createdAt).toLocaleDateString()}
				</p>
			</div>
		</Link>
	)
}
