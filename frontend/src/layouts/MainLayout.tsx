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
		<div>
			<header className="p-4 bg-white shadow-sm">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="text-lg font-semibold">CollabSpace</div>
					<nav className="flex items-center gap-4 text-sm">
						<Link to="/" className="text-gray-700 hover:text-indigo-600">
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<Link to="/profile" className="text-gray-700 hover:text-indigo-600">
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="text-gray-700 hover:text-indigo-600"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link to="/login" className="text-gray-700 hover:text-indigo-600">
									Login
								</Link>
								<Link to="/register" className="text-gray-700 hover:text-indigo-600">
									Register
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="max-w-6xl mx-auto p-4">
				<Outlet />
			</main>
		</div>
	)
}
