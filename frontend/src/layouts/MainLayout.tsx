import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function MainLayout() {
	const { isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

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
					<nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-300">
						<Link
							to="/"
							className={`rounded-full px-3 py-2 transition ${isActive('/') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
						>
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<Link
									to="/profile"
									className={`rounded-full px-3 py-2 transition ${isActive('/profile') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="rounded-full px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className={`rounded-full px-3 py-2 transition ${isActive('/login') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
								>
									Login
								</Link>
								<Link
									to="/register"
									className={`rounded-full px-3 py-2 transition ${isActive('/register') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/70 hover:text-white'}`}
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
