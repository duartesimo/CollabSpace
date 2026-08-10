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
			} catch (err) {
				setError('Unable to load your workspaces right now.')
			} finally {
				setLoading(false)
			}
		}

		void fetchWorkspaces()
	}, [isAuthenticated])

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-sm border border-gray-200">
					<h1 className="text-3xl font-semibold text-gray-900">Welcome to CollabSpace</h1>
					<p className="mt-4 text-gray-600">
						Organize your projects, collaborate with your team, and keep everything in one place.
					</p>
					<div className="mt-6 flex flex-col sm:flex-row gap-3">
						<Link to="/login" className="rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
							Log in
						</Link>
						<Link to="/register" className="rounded border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50">
							Create account
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-10">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
					<p className="mt-2 text-gray-600">Here are the workspaces available to you.</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-xl font-semibold text-gray-900">Your Workspaces</h2>
						<Link to="/workspaces/new" className="inline-flex items-center justify-center rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
							Create Workspace
						</Link>
					</div>

					{loading && <p className="mt-4 text-gray-600">Loading your workspaces...</p>}

					{error && <p className="mt-4 text-red-600">{error}</p>}

					{!loading && !error && workspaces.length === 0 && (
						<p className="mt-4 text-gray-600">You do not have any workspaces yet.</p>
					)}

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{workspaces.map((workspace) => (
							<div key={workspace.id} className="rounded-lg border border-gray-200 p-4">
								<h3 className="text-lg font-medium text-gray-900">{workspace.name}</h3>
								{workspace.description && <p className="mt-2 text-sm text-gray-600">{workspace.description}</p>}
								<div className="mt-4 text-sm text-gray-500">
									<p>Owner: {workspace.ownerUsername}</p>
									<p>Created: {new Date(workspace.createdAt).toLocaleDateString()}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
