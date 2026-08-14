import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import {
	addProjectMember,
	createProjectTask,
	deleteProject,
	getProject,
	getProjectMembers,
	getProjectTasks,
	getWorkspaceMembers,
	removeProjectMember,
	updateProject
} from '../features/workspace/api/workspace'
import type { Project, ProjectStatus } from '../features/project/types/Project'
import type { ProjectMember } from '../features/project/types/ProjectMember'
import TaskCard from '../features/task/components/TaskCard'
import type { Task } from '../features/task/types/Task'
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
	const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([])
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
	const [projectMembersLoading, setProjectMembersLoading] = useState(false)
	const [projectMembersError, setProjectMembersError] = useState<string | null>(null)
	const [projectMemberEmail, setProjectMemberEmail] = useState('')
	const [submittingProjectMember, setSubmittingProjectMember] = useState(false)
	const [projectMemberSubmitError, setProjectMemberSubmitError] = useState<string | null>(null)
	const [removingProjectMemberId, setRemovingProjectMemberId] = useState<number | null>(null)
	const [projectMemberRemoveError, setProjectMemberRemoveError] = useState<string | null>(null)
	const [tasks, setTasks] = useState<Task[]>([])
	const [tasksLoading, setTasksLoading] = useState(false)
	const [tasksError, setTasksError] = useState<string | null>(null)
	const [taskTitle, setTaskTitle] = useState('')
	const [taskDescription, setTaskDescription] = useState('')
	const [submittingTask, setSubmittingTask] = useState(false)
	const [taskSubmitError, setTaskSubmitError] = useState<string | null>(null)

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
			setWorkspaceMembers([])
			return
		}

		let isMounted = true

		const fetchMembers = async () => {
			try {
				const data = await getWorkspaceMembers(project.workspaceId)
				if (isMounted) {
					setWorkspaceMembers(data)
				}
			} catch {
				if (isMounted) {
					setWorkspaceMembers([])
				}
			}
		}

		void fetchMembers()

		return () => {
			isMounted = false
		}
	}, [project])

	useEffect(() => {
		if (project === null) {
			setTasks([])
			return
		}

		let isMounted = true

		const fetchTasks = async () => {
			setTasksLoading(true)
			setTasksError(null)

			try {
				const data = await getProjectTasks(project.id)
				if (isMounted) {
					setTasks(data)
				}
			} catch {
				if (isMounted) {
					setTasksError('Unable to load project tasks right now.')
				}
			} finally {
				if (isMounted) {
					setTasksLoading(false)
				}
			}
		}

		void fetchTasks()

		return () => {
			isMounted = false
		}
	}, [project])

	useEffect(() => {
		if (project === null) {
			setProjectMembers([])
			return
		}

		let isMounted = true

		const fetchProjectMembers = async () => {
			setProjectMembersLoading(true)
			setProjectMembersError(null)

			try {
				const data = await getProjectMembers(project.id)
				if (isMounted) {
					setProjectMembers(data)
				}
			} catch {
				if (isMounted) {
					setProjectMembersError('Unable to load project members right now.')
				}
			} finally {
				if (isMounted) {
					setProjectMembersLoading(false)
				}
			}
		}

		void fetchProjectMembers()

		return () => {
			isMounted = false
		}
	}, [project])

	const isCurrentUserOwner =
		currentUserId !== null &&
		workspaceMembers.some(
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

	const handleAddProjectMember = async (event: React.FormEvent) => {
		event.preventDefault()
		if (projectId === null || !projectMemberEmail.trim()) {
			setProjectMemberSubmitError('Please enter a valid email address.')
			return
		}

		setSubmittingProjectMember(true)
		setProjectMemberSubmitError(null)

		try {
			const createdMember = await addProjectMember(projectId, projectMemberEmail.trim())
			setProjectMembers((currentMembers) => [...currentMembers, createdMember])
			setProjectMemberEmail('')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setProjectMemberSubmitError(apiMessage || 'Unable to add this member right now.')
		} finally {
			setSubmittingProjectMember(false)
		}
	}

	const handleRemoveProjectMember = async (userId: number) => {
		if (
			projectId === null ||
			!window.confirm('Remove this member from the project?')
		) {
			return
		}

		setRemovingProjectMemberId(userId)
		setProjectMemberRemoveError(null)

		try {
			await removeProjectMember(projectId, userId)
			setProjectMembers((currentMembers) => currentMembers.filter((member) => member.userId !== userId))
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setProjectMemberRemoveError(apiMessage || 'Unable to remove this member right now.')
		} finally {
			setRemovingProjectMemberId(null)
		}
	}

	const handleCreateTask = async (event: React.FormEvent) => {
		event.preventDefault()
		if (projectId === null || !taskTitle.trim()) {
			setTaskSubmitError('Task title is required.')
			return
		}

		setSubmittingTask(true)
		setTaskSubmitError(null)

		try {
			const createdTask = await createProjectTask(projectId, {
				title: taskTitle.trim(),
				description: taskDescription.trim()
			})
			setTasks((currentTasks) => [createdTask, ...currentTasks])
			setTaskTitle('')
			setTaskDescription('')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setTaskSubmitError(apiMessage || 'Unable to create this task right now.')
		} finally {
			setSubmittingTask(false)
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

							<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
								<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
									<div>
										<h2 className="text-lg font-semibold text-white">Members</h2>
										<p className="mt-2 text-sm text-slate-400">
											People collaborating on this project.
										</p>
									</div>

									{isCurrentUserOwner && (
										<form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleAddProjectMember}>
											<input
												type="email"
												value={projectMemberEmail}
												onChange={(event) => setProjectMemberEmail(event.target.value)}
												placeholder="member@example.com"
												className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
											<button
												type="submit"
												disabled={submittingProjectMember}
												className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
											>
												{submittingProjectMember ? 'Adding...' : 'Add member'}
											</button>
										</form>
									)}
								</div>

								{projectMemberSubmitError && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectMemberSubmitError}
									</div>
								)}

								{projectMemberRemoveError && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectMemberRemoveError}
									</div>
								)}

								{projectMembersLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading members...</div>
								)}

								{projectMembersError && !projectMembersLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectMembersError}
									</div>
								)}

								{!projectMembersLoading && !projectMembersError && projectMembers.length === 0 && (
									<div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-4 text-sm text-slate-400">
										No project members yet.
									</div>
								)}

								{!projectMembersLoading && !projectMembersError && projectMembers.length > 0 && (
									<div className="mt-6 space-y-3">
										{projectMembers.map((member) => (
											<div
												key={member.userId}
												className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
											>
												<div>
													<p className="font-medium text-white">{member.username}</p>
													<p className="mt-1 text-sm text-slate-400">{member.email}</p>
												</div>
												<div className="flex items-center gap-3">
													<span
														className={`rounded-full px-3 py-1 text-xs font-semibold ${member.role === 'OWNER' ? 'bg-amber-500/15 text-amber-300' : 'bg-indigo-500/15 text-indigo-300'}`}
													>
														{member.role}
													</span>
													<span className="text-sm text-slate-500">
														Joined {new Date(member.joinedAt).toLocaleDateString()}
													</span>
													{isCurrentUserOwner && member.role === 'MEMBER' && (
														<button
															type="button"
															onClick={() => void handleRemoveProjectMember(member.userId)}
															disabled={removingProjectMemberId === member.userId}
															className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
														>
															{removingProjectMemberId === member.userId ? 'Removing...' : 'Remove'}
														</button>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
								<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
									<div>
										<h2 className="text-lg font-semibold text-white">Tasks</h2>
										<p className="mt-2 text-sm text-slate-400">
											Tasks in this project.
										</p>
									</div>

									<form className="w-full max-w-md space-y-3" onSubmit={handleCreateTask}>
										<input
											type="text"
											value={taskTitle}
											onChange={(event) => setTaskTitle(event.target.value)}
											placeholder="Task title"
											maxLength={100}
											required
											className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										/>
										<textarea
											value={taskDescription}
											onChange={(event) => setTaskDescription(event.target.value)}
											placeholder="Task description"
											maxLength={500}
											rows={3}
											className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										/>
										{taskSubmitError && (
											<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
												{taskSubmitError}
											</div>
										)}
										<button
											type="submit"
											disabled={submittingTask}
											className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{submittingTask ? 'Creating...' : 'Create task'}
										</button>
									</form>
								</div>

								{tasksLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading tasks...</div>
								)}

								{tasksError && !tasksLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{tasksError}
									</div>
								)}

								{!tasksLoading && !tasksError && tasks.length === 0 && (
									<div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-4 text-sm text-slate-400">
										No tasks yet.
									</div>
								)}

								{!tasksLoading && !tasksError && tasks.length > 0 && (
									<div className="mt-6 grid gap-4 xl:grid-cols-3">
										{(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((status) => {
											const columnTasks = tasks.filter((task) => task.status === status)

											return (
												<div key={status} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4">
													<div className="flex items-center justify-between gap-3">
														<h3 className="font-semibold text-white">{status}</h3>
														<span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
															{columnTasks.length}
														</span>
													</div>
													<div className="mt-4 space-y-3">
														{columnTasks.length > 0 ? (
															columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
														) : (
															<p className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-4 text-sm text-slate-500">
																No {status.toLowerCase().replace('_', ' ')} tasks.
															</p>
														)}
													</div>
												</div>
											)
										})}
									</div>
								)}
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
