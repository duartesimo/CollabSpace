import { Link } from 'react-router-dom'
import type { Workspace } from '../../features/workspace/types/Workspace'

interface WorkspaceCardProps {
	workspace: Workspace
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
	const workspaceInitial = workspace.name.trim().charAt(0).toUpperCase() || 'W'

	return (
		<Link
			to={`/workspaces/${workspace.id}`}
			className="group flex min-h-64 flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-950/20"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/15 text-lg font-semibold text-indigo-300">
					{workspaceInitial}
				</div>
				<span className="text-sm font-medium text-slate-500 transition group-hover:text-indigo-300">
					Open workspace <span aria-hidden="true">→</span>
				</span>
			</div>

			<div className="mt-6 min-w-0 flex-1">
				<h3 className="truncate text-xl font-semibold tracking-tight text-white">{workspace.name}</h3>
				<p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
					{workspace.description || 'No description provided for this workspace yet.'}
				</p>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-5 text-sm">
				<div className="min-w-0">
					<p className="text-xs uppercase tracking-wider text-slate-600">Owner</p>
					<p className="mt-1 truncate font-medium text-slate-300">{workspace.ownerUsername}</p>
				</div>
				<div>
					<p className="text-xs uppercase tracking-wider text-slate-600">Created</p>
					<p className="mt-1 font-medium text-slate-300">
						{new Date(workspace.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>
		</Link>
	)
}
