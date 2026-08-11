import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'
import { addWorkspaceMember, getWorkspace, getWorkspaceMembers, removeWorkspaceMember } from '../features/workspace/api/workspace'
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

		return () => {
			isMounted = false
		}
	}, [workspaceId])

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

	const isCurrentUserOwner =
		currentUserId !== null &&
		members.some(
			(member) =>
				member.userId === currentUserId &&
				member.role === 'OWNER'
		)

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
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
