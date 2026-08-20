import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EntityHeader from '../components/layout/EntityHeader'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
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
			<div className="text-slate-100">
				<section aria-labelledby="landing-title" className="relative overflow-hidden border-b border-slate-800/80 pb-16 pt-12 sm:pb-24 sm:pt-20">
					<div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_65%)]" />
					<div className="mx-auto max-w-5xl text-center">
						<StatusBadge className="px-4 py-1.5">CollabSpace</StatusBadge>
						<h1 id="landing-title" className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
							Turn team plans into finished work—without losing the context.
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
							Give teams a workspace, organize each initiative into projects, and move tasks from idea to done. Comments and activity preserve the story while notifications keep everyone aware.
						</p>
						<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link to="/register" className="inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto">
								Create your workspace
							</Link>
							<Link to="/login" className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto">
								Log in
							</Link>
						</div>
						<p className="mt-5 text-sm text-slate-500">Create an account, open a workspace, and invite your team in minutes.</p>
					</div>
				</section>

				<section aria-labelledby="features-title" className="py-16 sm:py-24">
					<div className="mx-auto max-w-7xl">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">Everything in context</p>
							<h2 id="features-title" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your team’s work, connected.</h2>
							<p className="mt-4 leading-7 text-slate-400">Move from team-level planning to individual tasks without scattering ownership, conversations, or updates across different tools.</p>
						</div>
						<div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							<Card className="min-h-52 transition hover:-translate-y-1 hover:border-slate-700">
								<p className="text-sm font-semibold text-indigo-300">01 / Workspaces</p>
								<h3 className="mt-5 text-lg font-semibold text-white">Separate work without silos</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">Give each team or initiative a focused home while keeping its people and projects organized.</p>
							</Card>
							<Card className="min-h-52 transition hover:-translate-y-1 hover:border-slate-700">
								<p className="text-sm font-semibold text-indigo-300">02 / Projects & tasks</p>
								<h3 className="mt-5 text-lg font-semibold text-white">Turn plans into progress</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">Break projects into owned tasks and see work move through a clear Kanban board.</p>
							</Card>
							<Card className="min-h-52 transition hover:-translate-y-1 hover:border-slate-700">
								<p className="text-sm font-semibold text-indigo-300">03 / Comments & activity</p>
								<h3 className="mt-5 text-lg font-semibold text-white">Keep the why with the work</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">Discuss tasks where they happen and use activity history to understand every change.</p>
							</Card>
							<Card className="min-h-52 transition hover:-translate-y-1 hover:border-slate-700">
								<p className="text-sm font-semibold text-indigo-300">04 / Notifications</p>
								<h3 className="mt-5 text-lg font-semibold text-white">Focus on what needs you</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">See assignments, status changes, and new comments without repeatedly checking every task.</p>
							</Card>
						</div>
					</div>
				</section>

				<section aria-labelledby="workflow-title" className="border-y border-slate-800/80 py-16 sm:py-20">
					<div className="mx-auto max-w-7xl">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">How it works</p>
							<h2 id="workflow-title" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A simple path from setup to delivery.</h2>
						</div>
						<div className="mt-10 grid gap-4 md:grid-cols-3">
							<Card className="relative overflow-hidden">
								<span aria-hidden="true" className="absolute right-5 top-3 text-5xl font-semibold text-slate-800/70">01</span>
								<p className="relative text-sm font-semibold text-indigo-300">Step 01</p>
								<h3 className="relative mt-6 text-lg font-semibold text-white">Create a workspace</h3>
								<p className="relative mt-3 text-sm leading-6 text-slate-400">Bring your team and its projects together in a shared, focused space.</p>
							</Card>
							<Card className="relative overflow-hidden">
								<span aria-hidden="true" className="absolute right-5 top-3 text-5xl font-semibold text-slate-800/70">02</span>
								<p className="relative text-sm font-semibold text-indigo-300">Step 02</p>
								<h3 className="relative mt-6 text-lg font-semibold text-white">Organize projects and tasks</h3>
								<p className="relative mt-3 text-sm leading-6 text-slate-400">Define the work, assign ownership, and track progress through clear task boards.</p>
							</Card>
							<Card className="relative overflow-hidden">
								<span aria-hidden="true" className="absolute right-5 top-3 text-5xl font-semibold text-slate-800/70">03</span>
								<p className="relative text-sm font-semibold text-indigo-300">Step 03</p>
								<h3 className="relative mt-6 text-lg font-semibold text-white">Collaborate with context</h3>
								<p className="relative mt-3 text-sm leading-6 text-slate-400">Keep comments, activity history, and important updates connected to each task.</p>
							</Card>
						</div>
					</div>
				</section>

				<section aria-labelledby="preview-title" className="py-16 sm:py-24">
					<div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2rem] border border-slate-800 bg-slate-900/50 p-6 shadow-2xl shadow-black/20 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">A clearer daily view</p>
							<h2 id="preview-title" className="mt-3 text-3xl font-semibold tracking-tight text-white">Know what needs attention next.</h2>
							<p className="mt-4 leading-7 text-slate-400">Projects provide the overview, task details hold the conversation, and notifications surface the updates that matter.</p>
							<Link to="/register" className="mt-7 inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/15 px-4 py-2.5 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
								Start collaborating <span aria-hidden="true" className="ml-2">→</span>
							</Link>
						</div>
						<div aria-label="Example task detail" className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-black/20 sm:p-5">
							<div className="flex items-center justify-between border-b border-slate-800 pb-4">
								<div>
									<p className="text-xs font-medium text-slate-500">Product team / Website redesign</p>
									<p className="mt-1 font-semibold text-white">Website redesign</p>
								</div>
								<StatusBadge>Active project</StatusBadge>
							</div>
							<div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/60 p-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-xs font-medium uppercase tracking-wider text-slate-500">Task</p>
										<h3 className="mt-2 text-lg font-semibold text-white">Build account settings</h3>
										<p className="mt-2 text-sm leading-6 text-slate-400">Create the profile controls and notification preferences for signed-in users.</p>
									</div>
									<StatusBadge tone="amber" className="shrink-0">In progress</StatusBadge>
								</div>
								<div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
									<p className="text-xs font-medium text-slate-500">Assigned to</p>
									<div className="flex items-center gap-2">
										<span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-200">MP</span>
										<span className="text-sm font-medium text-slate-200">Maya Patel</span>
									</div>
								</div>
							</div>
							<div className="mt-4 rounded-xl border border-indigo-400/15 bg-indigo-500/10 px-4 py-3">
								<p className="text-xs font-medium uppercase tracking-wider text-indigo-300">Recent activity</p>
								<div className="mt-2 flex items-center gap-3 text-sm text-indigo-100">
									<span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-xs">MP</span>
									<span><strong className="font-semibold">Maya</strong> commented: “The profile flow is ready for review.”</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section aria-labelledby="final-cta-title" className="border-t border-slate-800/80 py-16 text-center sm:py-20">
					<div className="mx-auto max-w-3xl">
						<h2 id="final-cta-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to organize your next project?</h2>
						<p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">Create a workspace and give your team one clear place to plan, execute, and stay informed.</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link to="/register" className="inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto">
								Create your workspace
							</Link>
							<Link to="/login" className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto">
								Log in
							</Link>
						</div>
					</div>
				</section>
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
