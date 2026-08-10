import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getWorkspaces } from '../features/workspace/api/workspace'
import type { Workspace } from '../features/workspace/types/Workspace'

export default function Home() {
	const { isAuthenticated } = useAuth()

	const [workspaces, setWorkspaces] = useState<Workspace[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!isAuthenticated) {
			return
		}

		const fetchWorkspaces = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await getWorkspaces()
				setWorkspaces(data)
			} catch {
				setError('Unable to load your workspaces right now.')
			} finally {
				setLoading(false)
			}
		}

		void fetchWorkspaces()
	}, [isAuthenticated])


	if (!isAuthenticated) {
		return (
			<div className="min-h-full bg-slate-950 text-slate-100">
				<div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
					<div className="mx-auto w-full max-w-3xl text-center">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
							Collaboration made simple
						</p>

						<h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
							CollabSpace brings your team together in one polished workspace.
						</h1>

						<p className="mt-6 text-lg leading-8 text-slate-300">
							Build, share, and review work with confidence.
						</p>

						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link to="/register">
								Get Started
							</Link>

							<Link to="/login">
								Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}


	return (
		<div className="min-h-screen bg-gray-50 px-4 py-10">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-gray-900">
						Welcome back
					</h1>

					<p className="mt-2 text-gray-600">
						Here are your workspaces.
					</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-xl font-semibold text-gray-900">
							Your Workspaces
						</h2>

						<Link
							to="/workspaces/new"
							className="rounded-md bg-indigo-600 px-4 py-2 text-white"
						>
							Create Workspace
						</Link>
					</div>

					{loading && (
						<p className="mt-4">Loading your workspaces...</p>
					)}

					{error && (
						<p className="mt-4 text-red-600">{error}</p>
					)}

					{!loading && !error && workspaces.length === 0 && (
						<p className="mt-4">
							You do not have any workspaces yet.
						</p>
					)}

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{workspaces.map((workspace) => (
							<div
								key={workspace.id}
								className="rounded-lg border border-gray-200 p-4"
							>
								<h3 className="text-lg font-medium">
									{workspace.name}
								</h3>

								<p>{workspace.description}</p>

								<p>
									Owner: {workspace.ownerUsername}
								</p>
							</div>
						))}
					</div>

				</div>
			</div>
		</div>
	)
}
