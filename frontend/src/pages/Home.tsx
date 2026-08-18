import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EntityHeader from '../components/layout/EntityHeader'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import WorkspaceCard from '../components/workspace/WorkspaceCard'
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
		<div className="text-slate-100">
			<div className="mx-auto max-w-7xl">
				<EntityHeader
					eyebrow="Dashboard"
					title="Welcome back"
					description="Choose a workspace to continue collaborating, or create a new space for your next initiative."
				>
					<Link
						to="/workspaces/new"
						className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
					>
						<span aria-hidden="true">+</span>&nbsp; Create workspace
					</Link>
				</EntityHeader>

				<section className="mt-8">
					<div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-xl font-semibold text-white">Your workspaces</h2>
							<p className="mt-1 text-sm text-slate-500">All the spaces where you collaborate with your teams.</p>
						</div>
						{!loading && !error && (
							<span className="w-fit rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-400">
								{workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
							</span>
						)}
					</div>

					{loading && (
						<LoadingState label="Loading your workspaces" variant="cards" />
					)}

					{error && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && workspaces.length === 0 && (
						<EmptyState
							className="py-16 sm:py-20"
							icon="+"
							title="Create your first workspace"
							description="Bring projects, tasks, and team collaboration together in one focused space."
							action={(
								<Link
									to="/workspaces/new"
									className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
								>
									Create workspace
								</Link>
							)}
						/>
					)}

					{!loading && !error && workspaces.length > 0 && (
						<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
							{workspaces.map((workspace) => (
								<WorkspaceCard key={workspace.id} workspace={workspace} />
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	)
}
