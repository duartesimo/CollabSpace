import { useEffect, useId, useRef, useState } from 'react'
import type { Notification } from '../types/Notification'
import NotificationDropdown from './NotificationDropdown'

interface NotificationBellProps {
	notifications: Notification[]
	loading: boolean
	error: string | null
	onMarkAsRead: (notificationId: number) => void | Promise<void>
}

export default function NotificationBell({
	notifications,
	loading,
	error,
	onMarkAsRead
}: NotificationBellProps) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const dropdownId = useId()
	const unreadCount = notifications.filter((notification) => !notification.read).length

	useEffect(() => {
		if (!isOpen) return

		const handlePointerDown = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false)
		}

		document.addEventListener('mousedown', handlePointerDown)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('mousedown', handlePointerDown)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
				aria-controls={dropdownId}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((currentValue) => !currentValue)}
				className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-300 outline-none transition hover:bg-slate-800/70 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
			>
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m9-2V11a6 6 0 1 0-12 0v4l-2 2h16l-2-2Zm-8 5h4" />
				</svg>
				{unreadCount > 0 && (
					<span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-slate-950">
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div id={dropdownId} className="absolute right-0 top-full z-50 mt-3">
					<NotificationDropdown
						notifications={notifications}
						loading={loading}
						error={error}
						onMarkAsRead={onMarkAsRead}
					/>
				</div>
			)}
		</div>
	)
}
