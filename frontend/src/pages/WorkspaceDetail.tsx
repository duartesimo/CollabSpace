import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import EntityHeader from '../components/layout/EntityHeader'
import Breadcrumbs from '../components/navigation/Breadcrumbs'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
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
		<div className="text-slate-100">
			<div className="mx-auto max-w-6xl">
				<Breadcrumbs
					items={[
						{ label: 'CollabSpace', href: '/' },
						{ label: workspace?.name || 'Workspace' }
					]}
				/>

				<div className="mt-6">
					{loading && (
						<div className="py-16 text-center text-slate-400">Loading workspace...</div>
					)}

					{error && !loading && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && workspace && (
						<div className="grid gap-8 lg:grid-cols-2">
							<div className="lg:col-span-2">
								<EntityHeader
									eyebrow="Workspace"
									title={workspace.name}
									description={workspace.description || 'No description provided for this workspace yet.'}
								>
									<span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300">
										Owner: {workspace.ownerUsername}
									</span>
									<span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-400">
										Created {new Date(workspace.createdAt).toLocaleDateString()}
									</span>
								</EntityHeader>
							</div>

							<Card className="order-1 shadow-xl shadow-black/10 lg:col-span-2">
								<SectionHeader
									title="Projects"
									description="Projects in this workspace."
									actions={isCurrentUserOwner ? (
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
									) : undefined}
								/>

								{projectsLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading projects...</div>
								)}

								{projectsError && !projectsLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectsError}
									</div>
								)}

								{!projectsLoading && !projectsError && projects.length === 0 && (
									<EmptyState className="mt-6" title="No projects yet" description="Create a project to start organizing work in this workspace." />
								)}

								{!projectsLoading && !projectsError && projects.length > 0 && (
									<div className="mt-6 grid gap-3 md:grid-cols-2">
										{projects.map((project) => (
											<Link
												key={project.id}
												to={`/projects/${project.id}`}
												className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/70"
											>
												<h3 className="font-medium text-white">{project.name}</h3>
												<p className="mt-2 text-sm leading-6 text-slate-400">
													{project.description || 'No description provided for this project yet.'}
												</p>
												<p className="mt-4 text-xs text-slate-500">
													Created {new Date(project.createdAt).toLocaleDateString()}
												</p>
											</Link>
										))}
									</div>
								)}
							</Card>

							{isCurrentUserOwner && (
								<Card className="order-3">
									<SectionHeader title="Settings" description="Update your workspace details." />

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
								</Card>
							)}

							<Card className={`order-2 ${isCurrentUserOwner ? '' : 'lg:col-span-2'}`}>
								<SectionHeader
									title="Members"
									description="Manage who can collaborate in this workspace."
									actions={isCurrentUserOwner ? (
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
									) : undefined}
								/>

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
									<EmptyState className="mt-6" title="No members yet" description="Add the first workspace member above." />
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
													<StatusBadge tone={member.role === 'OWNER' ? 'amber' : 'indigo'}>
														{member.role}
													</StatusBadge>
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
							</Card>

							{isCurrentUserOwner && (
								<Card className="order-4 lg:col-start-2" variant="danger">
									<SectionHeader title="Danger zone" description="Permanently delete this workspace and all of its memberships." className="[&_h2]:text-red-200" />

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
								</Card>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
