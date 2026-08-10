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
			<div className="mx-auto max-w-6xl">
				<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
							Dashboard
						</p>
						<h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
							Welcome back 👋
						</h1>
						<p className="mt-3 max-w-2xl text-slate-400">
							Manage your workspaces and keep your collaboration spaces organized.
						</p>
					</div>

					<Link
						to="/workspaces/new"
						className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
					>
						+ Create Workspace
					</Link>
				</div>

				<div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-white">Your Workspaces</h2>
							<p className="mt-1 text-sm text-slate-500">
								{workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
							</p>
						</div>
					</div>

					{loading && (
						<div className="py-12 text-center text-slate-400">
							Loading your workspaces...
						</div>
					)}

					{error && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && workspaces.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-16 text-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-3xl">
								✨
							</div>

							<h3 className="mt-5 text-xl font-semibold text-white">
								Create your first workspace
							</h3>

							<p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
								Start organizing your projects and collaboration spaces in one place.
							</p>

							<Link
								to="/workspaces/new"
								className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
							>
								Create Workspace
							</Link>
						</div>
					)}

					{!loading && !error && workspaces.length > 0 && (
						<div className="grid gap-5 md:grid-cols-2">
							{workspaces.map((workspace) => (
								<div
									key={workspace.id}
									className="group rounded-3xl border border-slate-800 bg-slate-950/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900"
								>
									<div className="flex items-start justify-between gap-4">
										<div>
											<h3 className="text-xl font-semibold text-white">
												{workspace.name}
											</h3>

											{workspace.description && (
												<p className="mt-2 text-sm leading-6 text-slate-400">
													{workspace.description}
												</p>
											)}
										</div>

										<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-lg text-indigo-300">
											◆
										</div>
									</div>

									<div className="mt-8 flex items-end justify-between gap-4">
										<div className="space-y-1 text-sm text-slate-500">
											<p>Owner: {workspace.ownerUsername}</p>
											<p>
												Created:{' '}
												{new Date(workspace.createdAt).toLocaleDateString()}
											</p>
										</div>

										<span className="text-sm font-medium text-indigo-400 opacity-0 transition group-hover:opacity-100">
											Workspace →
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
