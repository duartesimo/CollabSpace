import type { Activity } from '../types/Activity'

interface ActivityItemProps {
	activity: Activity
}

export default function ActivityItem({ activity }: ActivityItemProps) {
	return (
		<div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="font-medium text-white">{activity.user.username}</p>
					<p className="mt-1 text-sm text-slate-400">{activity.user.email}</p>
				</div>
				<span className="w-fit rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
					{activity.type}
				</span>
			</div>
			<p className="mt-4 text-sm leading-6 text-slate-300">{activity.description}</p>
			<p className="mt-4 text-xs text-slate-500">
				{new Date(activity.createdAt).toLocaleDateString()}
			</p>
		</div>
	)
}
