import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '../features/workspace/api/workspace'
import type { Project } from '../features/project/types/Project'

export default function ProjectDetail() {
	const { id } = useParams<{ id: string }>()

	const projectId = useMemo(() => {
		if (!id) {
			return null
		}

		const parsedId = Number(id)
		if (!Number.isInteger(parsedId) || parsedId <= 0) {
			return null
		}

		return parsedId
	}, [id])

	const [project, setProject] = useState<Project | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (projectId === null) {
			setError('Invalid project id.')
			setProject(null)
			return
		}

		let isMounted = true

		const fetchProject = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await getProject(projectId)
				if (isMounted) {
					setProject(data)
				}
			} catch {
				if (isMounted) {
					setError('Unable to load this project right now.')
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		void fetchProject()

		return () => {
			isMounted = false
		}
	}, [projectId])

	const backTo = project ? `/workspaces/${project.workspaceId}` : '/'
	const backLabel = project ? '← Back to workspace' : '← Back to dashboard'

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex items-center justify-between">
					<Link
						to={backTo}
						className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
					>
						{backLabel}
					</Link>
				</div>

				<div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/20 backdrop-blur">
					{loading && (
						<div className="py-16 text-center text-slate-400">Loading project...</div>
					)}

					{error && !loading && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && project && (
						<div className="space-y-8">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
									Project overview
								</p>
								<h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{project.name}</h1>
							</div>

							<div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Details</h2>
									<p className="mt-4 leading-7 text-slate-400">
										{project.description || 'No description provided for this project yet.'}
									</p>
								</div>

								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Project info</h2>
									<div className="mt-5 space-y-4 text-sm text-slate-400">
										<div>
											<p className="text-slate-500">Workspace</p>
											<Link to={`/workspaces/${project.workspaceId}`} className="mt-1 block font-medium text-indigo-300 hover:text-indigo-200">
												Workspace #{project.workspaceId}
											</Link>
										</div>
										<div>
											<p className="text-slate-500">Created</p>
											<p className="mt-1 font-medium text-slate-200">
												{new Date(project.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div>
											<p className="text-slate-500">Updated</p>
											<p className="mt-1 font-medium text-slate-200">
												{new Date(project.updatedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
