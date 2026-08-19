import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from '../features/notification/components/NotificationBell'
import type { Notification } from '../features/notification/types/Notification'
import { getNotifications, markNotificationAsRead } from '../features/workspace/api/workspace'
import useAuth from '../hooks/useAuth'

export default function MainLayout() {
	const { isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [notificationsLoading, setNotificationsLoading] = useState(false)
	const [notificationsError, setNotificationsError] = useState<string | null>(null)

	useEffect(() => {
		if (!isAuthenticated) {
			setNotifications([])
			setNotificationsLoading(false)
			setNotificationsError(null)
			return
		}

		let isMounted = true
		let isFetching = false

		const fetchNotifications = async (showLoading: boolean) => {
			if (isFetching) return

			isFetching = true
			if (showLoading) setNotificationsLoading(true)
			setNotificationsError(null)

			try {
				const data = await getNotifications()
				if (isMounted) setNotifications(data)
			} catch {
				if (isMounted) setNotificationsError('Unable to load notifications right now.')
			} finally {
				if (isMounted && showLoading) setNotificationsLoading(false)
				isFetching = false
			}
		}

		void fetchNotifications(true)
		const pollingInterval = window.setInterval(() => {
			void fetchNotifications(false)
		}, 30_000)

		return () => {
			isMounted = false
			window.clearInterval(pollingInterval)
		}
	}, [isAuthenticated])

	async function handleMarkNotificationAsRead(notificationId: number) {
		const notificationToUpdate = notifications.find((notification) => notification.id === notificationId)
		if (!notificationToUpdate || notificationToUpdate.read) return

		setNotificationsError(null)
		setNotifications((currentNotifications) => currentNotifications.map((notification) => (
			notification.id === notificationId ? { ...notification, read: true } : notification
		)))

		try {
			const updatedNotification = await markNotificationAsRead(notificationId)
			setNotifications((currentNotifications) => currentNotifications.map((notification) => (
				notification.id === updatedNotification.id ? updatedNotification : notification
			)))
		} catch {
			setNotifications((currentNotifications) => currentNotifications.map((notification) => (
				notification.id === notificationId ? notificationToUpdate : notification
			)))
			setNotificationsError('Unable to mark this notification as read.')
		}
	}

	function handleLogout() {
		logout()
		navigate('/login')
	}

	const isActive = (path: string) => location.pathname === path

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
					<Link to="/" className="text-xl font-semibold tracking-tight text-white transition hover:text-indigo-300">
						CollabSpace
					</Link>
					<nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-300 sm:gap-2">
						<Link
							to="/"
							className={`rounded-full px-2 py-2 transition sm:px-3 ${isActive('/') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
						>
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<Link
									to="/profile"
									className={`rounded-full px-2 py-2 transition sm:px-3 ${isActive('/profile') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="rounded-full px-2 py-2 transition hover:bg-slate-800/70 hover:text-white sm:px-3"
								>
									Logout
								</button>
								<NotificationBell
									notifications={notifications}
									loading={notificationsLoading}
									error={notificationsError}
									onMarkAsRead={handleMarkNotificationAsRead}
								/>
							</>
						) : (
							<>
								<Link
									to="/login"
									className={`rounded-full px-2 py-2 transition sm:px-3 ${isActive('/login') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
								>
									Login
								</Link>
								<Link
									to="/register"
									className={`rounded-full px-2 py-2 transition sm:px-3 ${isActive('/register') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
								>
									Register
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<Outlet />
			</main>
		</div>
	)
}
