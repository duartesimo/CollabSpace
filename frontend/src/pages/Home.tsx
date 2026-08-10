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
					<div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-slate-800/80 bg-slate-900/60 p-10 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-14">
						<p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">
							Collaboration made simple
						</p>
						<h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
							CollabSpace brings your team together in one polished workspace.
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
							Create clarity across projects, share ideas faster, and keep every workspace feeling calm and focused.
						</p>
						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link to="/register" className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
								Get Started
							</Link>
							<Link to="/login" className="rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
								Login
							</Link>
						</div>
						<div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
							<div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
								<p className="text-sm font-semibold text-white">Organized work</p>
								<p className="mt-2 text-sm text-slate-400">Keep projects and notes in one calm place.</p>
							</div>
							<div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
								<p className="text-sm font-semibold text-white">Built for teams</p>
								<p className="mt-2 text-sm text-slate-400">Share context instantly without the clutter.</p>
							</div>
							<div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
								<p className="text-sm font-semibold text-white">Fast setup</p>
								<p className="mt-2 text-sm text-slate-400">Start in minutes and focus on momentum.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-white">Welcome back</h1>
					<p className="mt-2 text-slate-400">Here are your workspaces.</p>
				</div>

				<div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-xl font-semibold text-white">Your Workspaces</h2>
						<Link to="/workspaces/new" className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
							Create Workspace
						</Link>
					</div>

					{loading && <p className="mt-4 text-slate-400">Loading your workspaces...</p>}

					{error && <p className="mt-4 text-red-400">{error}</p>}

					{!loading && !error && workspaces.length === 0 && (
						<p className="mt-4 text-slate-400">You do not have any workspaces yet.</p>
					)}

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{workspaces.map((workspace) => (
							<div key={workspace.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
								<h3 className="text-lg font-medium text-white">{workspace.name}</h3>
								{workspace.description && <p className="mt-2 text-sm leading-6 text-slate-400">{workspace.description}</p>}
								<div className="mt-4 space-y-1 text-sm text-slate-500">
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
