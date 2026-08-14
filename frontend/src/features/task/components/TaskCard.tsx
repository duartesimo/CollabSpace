import { Link } from 'react-router-dom'
import type { Task } from '../types/Task'

interface TaskCardProps {
	task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
	return (
		<Link
			to={`/tasks/${task.id}`}
			className="block rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/70"
		>
			<div className="flex items-start justify-between gap-3">
				<h3 className="font-medium text-white">{task.title}</h3>
				<span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
					{task.status}
				</span>
			</div>
			<p className="mt-2 text-sm leading-6 text-slate-400">
				{task.description || 'No description provided for this task yet.'}
			</p>
			<p className="mt-4 text-sm text-slate-400">
				Assigned: {task.assignee ? `${task.assignee.username} (${task.assignee.email})` : 'Unassigned'}
			</p>
			<p className="mt-1 text-xs text-slate-500">
				Created {new Date(task.createdAt).toLocaleDateString()}
			</p>
		</Link>
	)
}
