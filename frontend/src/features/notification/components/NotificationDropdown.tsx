import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import LoadingState from '../../../components/ui/LoadingState'
import StatusBadge from '../../../components/ui/StatusBadge'
import type { Notification, NotificationType } from '../types/Notification'

interface NotificationDropdownProps {
	notifications: Notification[]
	loading: boolean
	error: string | null
	onMarkAsRead: (notificationId: number) => void | Promise<void>
}

const notificationTypeMetadata: Record<NotificationType, {
	label: string
	tone: 'indigo' | 'amber' | 'emerald'
}> = {
	TASK_ASSIGNED: { label: 'Task assigned', tone: 'indigo' },
	COMMENT_CREATED: { label: 'New comment', tone: 'amber' },
	TASK_STATUS_CHANGED: { label: 'Status changed', tone: 'emerald' },
	PROJECT_MEMBER_ADDED: { label: 'Added to project', tone: 'indigo' },
	PROJECT_MEMBER_REMOVED: { label: 'Removed from project', tone: 'amber' }
}

function formatNotificationDate(value: string) {
	const createdAt = new Date(value)
	const elapsedMilliseconds = Date.now() - createdAt.getTime()

	if (Number.isNaN(createdAt.getTime())) {
		return { display: 'Unknown date', full: 'Unknown date' }
	}

	const full = createdAt.toLocaleString()
	if (elapsedMilliseconds < 0) {
		return { display: createdAt.toLocaleDateString(), full }
	}

	const elapsedMinutes = Math.floor(elapsedMilliseconds / 60_000)
	if (elapsedMinutes < 1) return { display: 'Just now', full }
	if (elapsedMinutes < 60) return { display: `${elapsedMinutes}m ago`, full }

	const elapsedHours = Math.floor(elapsedMinutes / 60)
	if (elapsedHours < 24) return { display: `${elapsedHours}h ago`, full }

	const elapsedDays = Math.floor(elapsedHours / 24)
	if (elapsedDays < 7) return { display: `${elapsedDays}d ago`, full }

	return {
		display: createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
		full
	}
}

export default function NotificationDropdown({
	notifications,
	loading,
	error,
	onMarkAsRead
}: NotificationDropdownProps) {
	return (
		<Card className="w-[min(24rem,calc(100vw-2rem))] shadow-2xl shadow-black/40">
			<div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
				<div>
					<h2 className="font-semibold text-white">Notifications</h2>
					<p className="mt-1 text-xs text-slate-500">Recent updates for your work.</p>
				</div>
				{!loading && (
					<span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-400">
						{notifications.length}
					</span>
				)}
			</div>

			{loading && <LoadingState className="mt-4" label="Loading notifications" variant="list" count={3} />}

			{error && !loading && (
				<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
					{error}
				</div>
			)}

			{!loading && !error && notifications.length === 0 && (
				<EmptyState
					className="mt-4"
					compact
					icon="✓"
					title="You’re all caught up"
					description="New assignments, comments, and status changes will appear here."
				/>
			)}

			{!loading && notifications.length > 0 && (
				<div className="mt-4 max-h-[min(28rem,65vh)] space-y-2 overflow-y-auto pr-1">
					{notifications.map((notification) => {
						const typeMetadata = notificationTypeMetadata[notification.type]
						const notificationDate = formatNotificationDate(notification.createdAt)

						return (
							<button
								key={notification.id}
								type="button"
								aria-label={notification.read ? `${notification.title}, read` : `Mark ${notification.title} as read`}
								onClick={() => {
									if (!notification.read) void onMarkAsRead(notification.id)
								}}
								className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left outline-none transition duration-150 active:scale-[0.995] focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/30 ${notification.read ? 'border-slate-800 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/60' : 'border-indigo-400/30 bg-indigo-500/10 shadow-sm shadow-indigo-950/20 hover:border-indigo-400/50 hover:bg-indigo-500/15'}`}
							>
								{!notification.read && <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-indigo-400" />}
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className={`line-clamp-2 text-sm ${notification.read ? 'font-medium text-slate-300' : 'font-semibold text-white'}`}>
											{notification.title}
										</p>
										<p className={`mt-1 line-clamp-3 text-sm leading-5 ${notification.read ? 'text-slate-500' : 'text-slate-300'}`}>
											{notification.message}
										</p>
									</div>
									{!notification.read && (
										<span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow shadow-indigo-400/40" aria-label="Unread" />
									)}
								</div>
								<div className="mt-3 flex items-center justify-between gap-3">
									<StatusBadge tone={typeMetadata.tone} className="px-2.5 py-0.5 text-[10px]">
										{typeMetadata.label}
									</StatusBadge>
									<time className="shrink-0 text-xs text-slate-500" dateTime={notification.createdAt} title={notificationDate.full}>
										{notificationDate.display}
									</time>
								</div>
							</button>
						)
					})}
				</div>
			)}
		</Card>
	)
}
