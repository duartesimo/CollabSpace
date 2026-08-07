import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function MainLayout() {
	const { isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()

	function handleLogout() {
		logout()
		navigate('/login')
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="border-b border-slate-200 bg-white/90 backdrop-blur-lg shadow-sm">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<div className="text-xl font-semibold tracking-tight text-slate-900">CollabSpace</div>
					<nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
						<Link
							to="/"
							className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
						>
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<Link
									to="/profile"
									className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
								>
									Register
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-6xl px-6 py-10">
				<Outlet />
			</main>
		</div>
	)
}
