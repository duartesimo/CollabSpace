import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import { deleteProject, getProject, getWorkspaceMembers, updateProject } from '../features/workspace/api/workspace'
import type { Project, ProjectStatus } from '../features/project/types/Project'
import type { WorkspaceMember } from '../features/workspace/types/WorkspaceMember'

interface CurrentUserResponse {
	id: number
	username: string
	email: string
	createdAt: string
}

export default function ProjectDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

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
	const [projectName, setProjectName] = useState('')
	const [projectDescription, setProjectDescription] = useState('')
	const [projectStatus, setProjectStatus] = useState<ProjectStatus>('ACTIVE')
	const [savingProject, setSavingProject] = useState(false)
	const [projectSaveError, setProjectSaveError] = useState<string | null>(null)
	const [deletingProject, setDeletingProject] = useState(false)
	const [projectDeleteError, setProjectDeleteError] = useState<string | null>(null)
	const [members, setMembers] = useState<WorkspaceMember[]>([])
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const response = await client.get<CurrentUserResponse>('/users/me')
				setCurrentUserId(response.data.id)
			} catch {
				setCurrentUserId(null)
			}
		}

		void fetchCurrentUser()
	}, [])

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
					setProjectName(data.name)
					setProjectDescription(data.description || '')
					setProjectStatus(data.status)
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

	useEffect(() => {
		if (project === null) {
			setMembers([])
			return
		}

		let isMounted = true

		const fetchMembers = async () => {
			try {
				const data = await getWorkspaceMembers(project.workspaceId)
				if (isMounted) {
					setMembers(data)
				}
			} catch {
				if (isMounted) {
					setMembers([])
				}
			}
		}

		void fetchMembers()

		return () => {
			isMounted = false
		}
	}, [project])

	const isCurrentUserOwner =
		currentUserId !== null &&
		members.some(
			(member) =>
				member.userId === currentUserId &&
				member.role === 'OWNER'
		)

	const handleUpdateProject = async (event: React.FormEvent) => {
		event.preventDefault()
		if (projectId === null || !projectName.trim()) {
			setProjectSaveError('Project name is required.')
			return
		}

		setSavingProject(true)
		setProjectSaveError(null)

		try {
			const updatedProject = await updateProject(projectId, {
				name: projectName.trim(),
				description: projectDescription.trim(),
				status: projectStatus
			})
			setProject(updatedProject)
			setProjectName(updatedProject.name)
			setProjectDescription(updatedProject.description || '')
			setProjectStatus(updatedProject.status)
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setProjectSaveError(apiMessage || 'Unable to update this project right now.')
		} finally {
			setSavingProject(false)
		}
	}

	const handleDeleteProject = async () => {
		if (
			projectId === null ||
			project === null ||
			!window.confirm('Delete this project? This action cannot be undone.')
		) {
			return
		}

		setDeletingProject(true)
		setProjectDeleteError(null)

		try {
			await deleteProject(projectId)
			navigate(`/workspaces/${project.workspaceId}`)
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setProjectDeleteError(apiMessage || 'Unable to delete this project right now.')
		} finally {
			setDeletingProject(false)
		}
	}

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

							{isCurrentUserOwner && (
								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Settings</h2>
									<p className="mt-2 text-sm text-slate-400">
										Update this project’s details and status.
									</p>

									<form className="mt-6 space-y-4" onSubmit={handleUpdateProject}>
										<div>
											<label htmlFor="project-name" className="text-sm font-medium text-slate-200">
												Project name
											</label>
											<input
												id="project-name"
												type="text"
												value={projectName}
												onChange={(event) => setProjectName(event.target.value)}
												maxLength={100}
												required
												className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
										</div>

										<div>
											<label htmlFor="project-description" className="text-sm font-medium text-slate-200">
												Description
											</label>
											<textarea
												id="project-description"
												value={projectDescription}
												onChange={(event) => setProjectDescription(event.target.value)}
												maxLength={500}
												rows={4}
												className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
										</div>

										<div>
											<label htmlFor="project-status" className="text-sm font-medium text-slate-200">
												Status
											</label>
											<select
												id="project-status"
												value={projectStatus}
												onChange={(event) => setProjectStatus(event.target.value as ProjectStatus)}
												className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											>
												<option value="ACTIVE">ACTIVE</option>
												<option value="COMPLETED">COMPLETED</option>
												<option value="ARCHIVED">ARCHIVED</option>
											</select>
										</div>

										{projectSaveError && (
											<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
												{projectSaveError}
											</div>
										)}

										<button
											type="submit"
											disabled={savingProject}
											className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{savingProject ? 'Saving...' : 'Save changes'}
										</button>
									</form>
								</div>
							)}

							{isCurrentUserOwner && (
								<div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
									<h2 className="text-lg font-semibold text-red-200">Danger zone</h2>
									<p className="mt-2 text-sm text-slate-400">
										Permanently delete this project.
									</p>

									{projectDeleteError && (
										<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
											{projectDeleteError}
										</div>
									)}

									<button
										type="button"
										onClick={() => void handleDeleteProject()}
										disabled={deletingProject}
										className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{deletingProject ? 'Deleting...' : 'Delete project'}
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
