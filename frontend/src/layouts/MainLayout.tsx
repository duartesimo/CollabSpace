import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
	return (
		<div>
			<header className="p-4 bg-white shadow-sm">
				<div className="max-w-6xl mx-auto">CollabSpace</div>
			</header>
			<main className="max-w-6xl mx-auto p-4">
				<Outlet />
			</main>
		</div>
	)
}
