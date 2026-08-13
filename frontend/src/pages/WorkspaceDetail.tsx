import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import {
	addWorkspaceMember,
	createWorkspaceProject,
	deleteWorkspace,
	getWorkspace,
	getWorkspaceMembers,
	getWorkspaceProjects,
	removeWorkspaceMember,
	updateWorkspace
} from '../features/workspace/api/workspace'
import type { Project } from '../features/project/types/Project'
import type { Workspace } from '../features/workspace/types/Workspace'
import type { WorkspaceMember } from '../features/workspace/types/WorkspaceMember'

interface CurrentUserResponse {
	id: number
	username: string
	email: string
	createdAt: string
}

export default function WorkspaceDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const workspaceId = useMemo(() => {
		if (!id) {
			return null
		}

		const parsedId = Number(id)
		if (!Number.isInteger(parsedId) || parsedId <= 0) {
			return null
		}

		return parsedId
	}, [id])

	const [workspace, setWorkspace] = useState<Workspace | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [workspaceName, setWorkspaceName] = useState('')
	const [workspaceDescription, setWorkspaceDescription] = useState('')
	const [savingWorkspace, setSavingWorkspace] = useState(false)
	const [workspaceSaveError, setWorkspaceSaveError] = useState<string | null>(null)
	const [deletingWorkspace, setDeletingWorkspace] = useState(false)
	const [workspaceDeleteError, setWorkspaceDeleteError] = useState<string | null>(null)
	const [projects, setProjects] = useState<Project[]>([])
	const [projectsLoading, setProjectsLoading] = useState(false)
	const [projectsError, setProjectsError] = useState<string | null>(null)
	const [projectName, setProjectName] = useState('')
	const [projectDescription, setProjectDescription] = useState('')
	const [submittingProject, setSubmittingProject] = useState(false)
	const [projectSubmitError, setProjectSubmitError] = useState<string | null>(null)
	const [members, setMembers] = useState<WorkspaceMember[]>([])
	const [membersLoading, setMembersLoading] = useState(false)
	const [membersError, setMembersError] = useState<string | null>(null)
	const [memberEmail, setMemberEmail] = useState('')
	const [submittingMember, setSubmittingMember] = useState(false)
	const [memberSubmitError, setMemberSubmitError] = useState<string | null>(null)
	const [removingMemberId, setRemovingMemberId] = useState<number | null>(null)
	const [removeMemberError, setRemoveMemberError] = useState<string | null>(null)
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
		if (workspaceId === null) {
			setError('Invalid workspace id.')
			setWorkspace(null)
			return
		}

		let isMounted = true

		const fetchWorkspace = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await getWorkspace(workspaceId)
				if (isMounted) {
					setWorkspace(data)
					setWorkspaceName(data.name)
					setWorkspaceDescription(data.description || '')
				}
			} catch {
				if (isMounted) {
					setError('Unable to load this workspace right now.')
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		void fetchWorkspace()

		const fetchMembers = async () => {
			setMembersLoading(true)
			setMembersError(null)

			try {
				const data = await getWorkspaceMembers(workspaceId)
				if (isMounted) {
					setMembers(data)
				}
			} catch {
				if (isMounted) {
					setMembersError('Unable to load workspace members right now.')
				}
			} finally {
				if (isMounted) {
					setMembersLoading(false)
				}
			}
		}

		void fetchMembers()

		const fetchProjects = async () => {
			setProjectsLoading(true)
			setProjectsError(null)

			try {
				const data = await getWorkspaceProjects(workspaceId)
				if (isMounted) {
					setProjects(data)
				}
			} catch {
				if (isMounted) {
					setProjectsError('Unable to load workspace projects right now.')
				}
			} finally {
				if (isMounted) {
					setProjectsLoading(false)
				}
			}
		}

		void fetchProjects()

		return () => {
			isMounted = false
		}
	}, [workspaceId])

	const isCurrentUserOwner =
		currentUserId !== null &&
		members.some(
			(member) =>
				member.userId === currentUserId &&
				member.role === 'OWNER'
		)

	const handleUpdateWorkspace = async (event: React.FormEvent) => {
		event.preventDefault()
		if (workspaceId === null || !workspaceName.trim()) {
			setWorkspaceSaveError('Workspace name is required.')
			return
		}

		setSavingWorkspace(true)
		setWorkspaceSaveError(null)

		try {
			const updatedWorkspace = await updateWorkspace(workspaceId, {
				name: workspaceName.trim(),
				description: workspaceDescription.trim()
			})
			setWorkspace(updatedWorkspace)
			setWorkspaceName(updatedWorkspace.name)
			setWorkspaceDescription(updatedWorkspace.description || '')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setWorkspaceSaveError(apiMessage || 'Unable to update this workspace right now.')
		} finally {
			setSavingWorkspace(false)
		}
	}

	const handleDeleteWorkspace = async () => {
		if (workspaceId === null || !window.confirm('Delete this workspace? This action cannot be undone.')) {
			return
		}

		setDeletingWorkspace(true)
		setWorkspaceDeleteError(null)

		try {
			await deleteWorkspace(workspaceId)
			navigate('/')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setWorkspaceDeleteError(apiMessage || 'Unable to delete this workspace right now.')
		} finally {
			setDeletingWorkspace(false)
		}
	}

	const handleCreateProject = async (event: React.FormEvent) => {
		event.preventDefault()
		if (workspaceId === null || !projectName.trim()) {
			setProjectSubmitError('Project name is required.')
			return
		}

		setSubmittingProject(true)
		setProjectSubmitError(null)

		try {
			const createdProject = await createWorkspaceProject(workspaceId, {
				name: projectName.trim(),
				description: projectDescription.trim()
			})
			setProjects((currentProjects) => [...currentProjects, createdProject])
			setProjectName('')
			setProjectDescription('')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setProjectSubmitError(apiMessage || 'Unable to create this project right now.')
		} finally {
			setSubmittingProject(false)
		}
	}

	const handleAddMember = async (event: React.FormEvent) => {
		event.preventDefault()
		if (workspaceId === null || !memberEmail.trim()) {
			setMemberSubmitError('Please enter a valid email address.')
			return
		}

		setSubmittingMember(true)
		setMemberSubmitError(null)

		try {
			const createdMember = await addWorkspaceMember(workspaceId, memberEmail.trim())
			setMembers((currentMembers) => [...currentMembers, createdMember])
			setMemberEmail('')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setMemberSubmitError(apiMessage || 'Unable to add this member right now.')
		} finally {
			setSubmittingMember(false)
		}
	}

	const handleRemoveMember = async (memberId: number) => {
		if (workspaceId === null) {
			return
		}

		setRemovingMemberId(memberId)
		setRemoveMemberError(null)

		try {
			await removeWorkspaceMember(workspaceId, memberId)
			setMembers((currentMembers) => currentMembers.filter((member) => member.userId !== memberId))
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setRemoveMemberError(apiMessage || 'Unable to remove this member right now.')
		} finally {
			setRemovingMemberId(null)
		}
	}

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex items-center justify-between">
					<Link
						to="/"
						className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
					>
						← Back to dashboard
					</Link>
				</div>

				<div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/20 backdrop-blur">
					{loading && (
						<div className="py-16 text-center text-slate-400">Loading workspace...</div>
					)}

					{error && !loading && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && workspace && (
						<div className="space-y-8">
							<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
										Workspace overview
									</p>
									<h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
										{workspace.name}
									</h1>
								</div>
							</div>

							<div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Details</h2>
									<p className="mt-4 leading-7 text-slate-400">
										{workspace.description || 'No description provided for this workspace yet.'}
									</p>
								</div>

								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Quick info</h2>
									<div className="mt-5 space-y-4 text-sm text-slate-400">
										<div>
											<p className="text-slate-500">Owner</p>
											<p className="mt-1 font-medium text-slate-200">{workspace.ownerUsername}</p>
										</div>
										<div>
											<p className="text-slate-500">Created</p>
											<p className="mt-1 font-medium text-slate-200">
												{new Date(workspace.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
								<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
									<div>
										<h2 className="text-lg font-semibold text-white">Projects</h2>
										<p className="mt-2 text-sm text-slate-400">
											Projects in this workspace.
										</p>
									</div>

									{isCurrentUserOwner && (
										<form className="w-full max-w-md space-y-3" onSubmit={handleCreateProject}>
											<input
												type="text"
												value={projectName}
												onChange={(event) => setProjectName(event.target.value)}
												placeholder="Project name"
												maxLength={100}
												required
												className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
											<textarea
												value={projectDescription}
												onChange={(event) => setProjectDescription(event.target.value)}
												placeholder="Project description"
												maxLength={500}
												rows={3}
												className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
											{projectSubmitError && (
												<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
													{projectSubmitError}
												</div>
											)}
											<button
												type="submit"
												disabled={submittingProject}
												className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
											>
												{submittingProject ? 'Creating...' : 'Create project'}
											</button>
										</form>
									)}
								</div>

								{projectsLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading projects...</div>
								)}

								{projectsError && !projectsLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectsError}
									</div>
								)}

								{!projectsLoading && !projectsError && projects.length === 0 && (
									<div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-4 text-sm text-slate-400">
										No projects yet.
									</div>
								)}

								{!projectsLoading && !projectsError && projects.length > 0 && (
									<div className="mt-6 grid gap-3 md:grid-cols-2">
										{projects.map((project) => (
											<div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
												<h3 className="font-medium text-white">{project.name}</h3>
												<p className="mt-2 text-sm leading-6 text-slate-400">
													{project.description || 'No description provided for this project yet.'}
												</p>
												<p className="mt-4 text-xs text-slate-500">
													Created {new Date(project.createdAt).toLocaleDateString()}
												</p>
											</div>
										))}
									</div>
								)}
							</div>

							{isCurrentUserOwner && (
								<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
									<h2 className="text-lg font-semibold text-white">Settings</h2>
									<p className="mt-2 text-sm text-slate-400">
										Update your workspace details.
									</p>

									<form className="mt-6 space-y-4" onSubmit={handleUpdateWorkspace}>
										<div>
											<label htmlFor="workspace-name" className="text-sm font-medium text-slate-200">
												Workspace name
											</label>
											<input
												id="workspace-name"
												type="text"
												value={workspaceName}
												onChange={(event) => setWorkspaceName(event.target.value)}
												maxLength={100}
												required
												className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
										</div>

										<div>
											<label htmlFor="workspace-description" className="text-sm font-medium text-slate-200">
												Description
											</label>
											<textarea
												id="workspace-description"
												value={workspaceDescription}
												onChange={(event) => setWorkspaceDescription(event.target.value)}
												maxLength={500}
												rows={4}
												className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
										</div>

										{workspaceSaveError && (
											<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
												{workspaceSaveError}
											</div>
										)}

										<button
											type="submit"
											disabled={savingWorkspace}
											className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{savingWorkspace ? 'Saving...' : 'Save changes'}
										</button>
									</form>
								</div>
							)}

							<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
								<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
									<div>
										<h2 className="text-lg font-semibold text-white">Members</h2>
										<p className="mt-2 text-sm text-slate-400">
											Manage who can collaborate in this workspace.
										</p>
									</div>

									{isCurrentUserOwner && (
										<form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleAddMember}>
											<input
												type="email"
												value={memberEmail}
												onChange={(event) => setMemberEmail(event.target.value)}
												placeholder="member@example.com"
												className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
											/>
											<button
												type="submit"
												disabled={submittingMember}
												className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
											>
												{submittingMember ? 'Adding...' : 'Add member'}
											</button>
										</form>
									)}
								</div>

								{memberSubmitError && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{memberSubmitError}
									</div>
								)}

								{removeMemberError && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{removeMemberError}
									</div>
								)}

								{membersLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading members...</div>
								)}

								{membersError && !membersLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{membersError}
									</div>
								)}

								{!membersLoading && !membersError && members.length === 0 && (
									<div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-4 text-sm text-slate-400">
										No members yet. Add the first one above.
									</div>
								)}

								{!membersLoading && !membersError && members.length > 0 && (
									<div className="mt-6 space-y-3">
										{members.map((member) => (
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
													{isCurrentUserOwner && member.role !== 'OWNER' && (
														<button
															type="button"
															onClick={() => void handleRemoveMember(member.userId)}
															disabled={removingMemberId === member.userId}
															className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
														>
															{removingMemberId === member.userId ? 'Removing...' : 'Remove'}
														</button>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{isCurrentUserOwner && (
								<div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
									<h2 className="text-lg font-semibold text-red-200">Danger zone</h2>
									<p className="mt-2 text-sm text-slate-400">
										Permanently delete this workspace and all of its memberships.
									</p>

									{workspaceDeleteError && (
										<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
											{workspaceDeleteError}
										</div>
									)}

									<button
										type="button"
										onClick={() => void handleDeleteWorkspace()}
										disabled={deletingWorkspace}
										className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{deletingWorkspace ? 'Deleting...' : 'Delete workspace'}
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
