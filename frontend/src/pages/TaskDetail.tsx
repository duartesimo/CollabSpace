import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import EntityHeader from '../components/layout/EntityHeader'
import Breadcrumbs from '../components/navigation/Breadcrumbs'
import Card from '../components/ui/Card'
import CollapsiblePanel from '../components/ui/CollapsiblePanel'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import {
	assignTask,
	createTaskComment,
	deleteComment,
	deleteTask,
	getProject,
	getProjectMembers,
	getTask,
	getTaskActivity,
	getTaskComments,
	getWorkspace,
	unassignTask,
	updateTask
} from '../features/workspace/api/workspace'
import ActivityItem from '../features/activity/components/ActivityItem'
import type { Activity } from '../features/activity/types/Activity'
import CommentCard from '../features/comment/components/CommentCard'
import type { Comment } from '../features/comment/types/Comment'
import type { Project } from '../features/project/types/Project'
import type { Task, TaskStatus } from '../features/task/types/Task'
import type { ProjectMember } from '../features/project/types/ProjectMember'
import type { Workspace } from '../features/workspace/types/Workspace'

interface CurrentUserResponse {
	id: number
}

export default function TaskDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const taskId = useMemo(() => {
		if (!id) {
			return null
		}

		const parsedId = Number(id)
		if (!Number.isInteger(parsedId) || parsedId <= 0) {
			return null
		}

		return parsedId
	}, [id])

	const [task, setTask] = useState<Task | null>(null)
	const [projectContext, setProjectContext] = useState<Project | null>(null)
	const [workspaceContext, setWorkspaceContext] = useState<Workspace | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [taskTitle, setTaskTitle] = useState('')
	const [taskDescription, setTaskDescription] = useState('')
	const [taskStatus, setTaskStatus] = useState<TaskStatus>('TODO')
	const [savingTask, setSavingTask] = useState(false)
	const [taskSaveError, setTaskSaveError] = useState<string | null>(null)
	const [deletingTask, setDeletingTask] = useState(false)
	const [taskDeleteError, setTaskDeleteError] = useState<string | null>(null)
	const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
	const [projectMembersLoading, setProjectMembersLoading] = useState(false)
	const [projectMembersError, setProjectMembersError] = useState<string | null>(null)
	const [selectedAssigneeId, setSelectedAssigneeId] = useState('')
	const [assigningTask, setAssigningTask] = useState(false)
	const [assignmentError, setAssignmentError] = useState<string | null>(null)
	const [unassigningTask, setUnassigningTask] = useState(false)
	const [comments, setComments] = useState<Comment[]>([])
	const [commentsLoading, setCommentsLoading] = useState(false)
	const [commentsError, setCommentsError] = useState<string | null>(null)
	const [commentText, setCommentText] = useState('')
	const [submittingComment, setSubmittingComment] = useState(false)
	const [commentSubmitError, setCommentSubmitError] = useState<string | null>(null)
	const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
	const [commentDeleteError, setCommentDeleteError] = useState<string | null>(null)
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [activities, setActivities] = useState<Activity[]>([])
	const [activitiesLoading, setActivitiesLoading] = useState(false)
	const [activitiesError, setActivitiesError] = useState<string | null>(null)

	const taskProjectId = task?.projectId
	const taskCommentId = task?.id
	const taskActivityId = task?.id

	useEffect(() => {
		let isMounted = true

		const fetchCurrentUser = async () => {
			try {
				const response = await client.get<CurrentUserResponse>('/users/me')
				if (isMounted) {
					setCurrentUserId(response.data.id)
				}
			} catch {
				if (isMounted) {
					setCurrentUserId(null)
				}
			}
		}

		void fetchCurrentUser()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		if (taskId === null) {
			setError('Invalid task id.')
			setTask(null)
			return
		}

		let isMounted = true

		const fetchTask = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await getTask(taskId)
				if (isMounted) {
					setTask(data)
					setTaskTitle(data.title)
					setTaskDescription(data.description || '')
					setTaskStatus(data.status)
				}
			} catch {
				if (isMounted) {
					setError('Unable to load this task right now.')
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		void fetchTask()

		return () => {
			isMounted = false
		}
	}, [taskId])

	useEffect(() => {
		if (taskProjectId === undefined) {
			setProjectContext(null)
			return
		}

		let isMounted = true

		const fetchProjectContext = async () => {
			try {
				const data = await getProject(taskProjectId)
				if (isMounted) {
					setProjectContext(data)
				}
			} catch {
				if (isMounted) {
					setProjectContext(null)
				}
			}
		}

		void fetchProjectContext()

		return () => {
			isMounted = false
		}
	}, [taskProjectId])

	useEffect(() => {
		if (projectContext === null) {
			setWorkspaceContext(null)
			return
		}

		let isMounted = true

		const fetchWorkspaceContext = async () => {
			try {
				const data = await getWorkspace(projectContext.workspaceId)
				if (isMounted) {
					setWorkspaceContext(data)
				}
			} catch {
				if (isMounted) {
					setWorkspaceContext(null)
				}
			}
		}

		void fetchWorkspaceContext()

		return () => {
			isMounted = false
		}
	}, [projectContext?.workspaceId])

	useEffect(() => {
		if (taskProjectId === undefined) {
			setProjectMembers([])
			return
		}

		let isMounted = true

		const fetchProjectMembers = async () => {
			setProjectMembersLoading(true)
			setProjectMembersError(null)

			try {
				const data = await getProjectMembers(taskProjectId)
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
	}, [taskProjectId])

	useEffect(() => {
		if (taskCommentId === undefined) {
			setComments([])
			return
		}

		let isMounted = true

		const fetchComments = async () => {
			setCommentsLoading(true)
			setCommentsError(null)

			try {
				const data = await getTaskComments(taskCommentId)
				if (isMounted) {
					setComments(data)
				}
			} catch {
				if (isMounted) {
					setCommentsError('Unable to load task comments right now.')
				}
			} finally {
				if (isMounted) {
					setCommentsLoading(false)
				}
			}
		}

		void fetchComments()

		return () => {
			isMounted = false
		}
	}, [taskCommentId])

	const refreshActivity = useCallback(async () => {
		if (taskActivityId === undefined) {
			setActivities([])
			return
		}

		setActivitiesLoading(true)
		setActivitiesError(null)

		try {
			const data = await getTaskActivity(taskActivityId)
			setActivities(data)
		} catch {
			setActivitiesError('Unable to load task activity right now.')
		} finally {
			setActivitiesLoading(false)
		}
	}, [taskActivityId])

	useEffect(() => {
		if (taskActivityId === undefined) {
			setActivities([])
			return
		}

		let isMounted = true

		const fetchActivity = async () => {
			setActivitiesLoading(true)
			setActivitiesError(null)

			try {
				const data = await getTaskActivity(taskActivityId)
				if (isMounted) {
					setActivities(data)
				}
			} catch {
				if (isMounted) {
					setActivitiesError('Unable to load task activity right now.')
				}
			} finally {
				if (isMounted) {
					setActivitiesLoading(false)
				}
			}
		}

		void fetchActivity()

		return () => {
			isMounted = false
		}
	}, [taskActivityId])

	const handleUpdateTask = async (event: React.FormEvent) => {
		event.preventDefault()
		if (taskId === null || !taskTitle.trim()) {
			setTaskSaveError('Task title is required.')
			return
		}

		setSavingTask(true)
		setTaskSaveError(null)

		try {
			const updatedTask = await updateTask(taskId, {
				title: taskTitle.trim(),
				description: taskDescription.trim(),
				status: taskStatus
			})
			setTask(updatedTask)
			setTaskTitle(updatedTask.title)
			setTaskDescription(updatedTask.description || '')
			setTaskStatus(updatedTask.status)
			await refreshActivity()
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setTaskSaveError(apiMessage || 'Unable to update this task right now.')
		} finally {
			setSavingTask(false)
		}
	}

	const handleDeleteTask = async () => {
		if (
			taskId === null ||
			task === null ||
			!window.confirm('Delete this task? This action cannot be undone.')
		) {
			return
		}

		setDeletingTask(true)
		setTaskDeleteError(null)

		try {
			await deleteTask(taskId)
			navigate(`/projects/${task.projectId}`)
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setTaskDeleteError(apiMessage || 'Unable to delete this task right now.')
		} finally {
			setDeletingTask(false)
		}
	}

	const handleAssignTask = async () => {
		if (taskId === null || !selectedAssigneeId) {
			setAssignmentError('Please select a project member.')
			return
		}

		setAssigningTask(true)
		setAssignmentError(null)

		try {
			const updatedTask = await assignTask(taskId, Number(selectedAssigneeId))
			setTask(updatedTask)
			setSelectedAssigneeId('')
			await refreshActivity()
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setAssignmentError(apiMessage || 'Unable to assign this task right now.')
		} finally {
			setAssigningTask(false)
		}
	}

	const handleUnassignTask = async () => {
		if (taskId === null) {
			return
		}

		setUnassigningTask(true)
		setAssignmentError(null)

		try {
			const updatedTask = await unassignTask(taskId)
			setTask(updatedTask)
			await refreshActivity()
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setAssignmentError(apiMessage || 'Unable to unassign this task right now.')
		} finally {
			setUnassigningTask(false)
		}
	}

	const handleCreateComment = async (event: React.FormEvent) => {
		event.preventDefault()
		if (taskCommentId === undefined || !commentText.trim()) {
			setCommentSubmitError('Comment content is required.')
			return
		}

		setSubmittingComment(true)
		setCommentSubmitError(null)

		try {
			const createdComment = await createTaskComment(taskCommentId, { content: commentText.trim() })
			setComments((currentComments) => [...currentComments, createdComment])
			setCommentText('')
			await refreshActivity()
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setCommentSubmitError(apiMessage || 'Unable to create this comment right now.')
		} finally {
			setSubmittingComment(false)
		}
	}

	const handleDeleteComment = async (commentId: number) => {
		if (!window.confirm('Delete this comment? This action cannot be undone.')) {
			return
		}

		setDeletingCommentId(commentId)
		setCommentDeleteError(null)

		try {
			await deleteComment(commentId)
			setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId))
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setCommentDeleteError(apiMessage || 'Unable to delete this comment right now.')
		} finally {
			setDeletingCommentId(null)
		}
	}

	return (
		<div className="text-slate-100">
			<div className="mx-auto max-w-7xl">
				<Breadcrumbs
					items={[
						{ label: 'CollabSpace', href: '/' },
						{
							label: workspaceContext?.name || (projectContext ? `Workspace #${projectContext.workspaceId}` : 'Workspace'),
							href: projectContext ? `/workspaces/${projectContext.workspaceId}` : undefined
						},
						{
							label: projectContext?.name || (task ? `Project #${task.projectId}` : 'Project'),
							href: task ? `/projects/${task.projectId}` : undefined
						},
						{ label: task?.title || 'Task' }
					]}
				/>

				<div className="mt-6">
					{loading && (
						<div className="py-16 text-center text-slate-400">Loading task...</div>
					)}

					{error && !loading && (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
							{error}
						</div>
					)}

					{!loading && !error && task && (
						<div className="flex flex-col gap-8">
							<EntityHeader
								eyebrow="Task"
								title={task.title}
							>
								<StatusBadge className="py-1.5">
									{task.status}
								</StatusBadge>
								<Link
									to={`/projects/${task.projectId}`}
									className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
								>
									{projectContext?.name || `Project #${task.projectId}`}
								</Link>
								<span className="text-xs text-slate-400">
									{task.assignee ? `Assigned to ${task.assignee.username}` : 'Unassigned'}
								</span>
							</EntityHeader>

							<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
								<div className="contents">
									<Card className="order-1 lg:col-start-1 lg:row-start-1">
									<SectionHeader title="Details" />
									<p className="mt-4 leading-7 text-slate-400">
										{task.description || 'No description provided for this task yet.'}
									</p>
								</Card>

									<CollapsiblePanel className="order-4 lg:col-start-2 lg:row-start-1" title="Advanced metadata" description="Project context and task timestamps." variant="muted">
									<div className="space-y-4 text-sm text-slate-400">
										<div>
											<p className="text-slate-500">Project</p>
											<Link to={`/projects/${task.projectId}`} className="mt-1 block font-medium text-indigo-300 hover:text-indigo-200">
													{projectContext?.name || `Project #${task.projectId}`}
											</Link>
										</div>
										<div>
											<p className="text-slate-500">Created</p>
											<p className="mt-1 font-medium text-slate-200">
												{new Date(task.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div>
											<p className="text-slate-500">Updated</p>
											<p className="mt-1 font-medium text-slate-200">
												{new Date(task.updatedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									</CollapsiblePanel>
							</div>

							<Card className="order-5 lg:col-start-2 lg:row-start-2" variant="muted">
								<SectionHeader title="Assignment" description="Assign this task to a project member." />

								<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
									<p className="text-sm text-slate-500">Current assignee</p>
									{task.assignee ? (
										<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="font-medium text-white">{task.assignee.username}</p>
												<p className="mt-1 text-sm text-slate-400">{task.assignee.email}</p>
											</div>
											<button
												type="button"
												onClick={() => void handleUnassignTask()}
												disabled={unassigningTask}
												className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
											>
												{unassigningTask ? 'Removing...' : 'Unassign'}
											</button>
										</div>
									) : (
										<p className="mt-2 text-sm text-slate-400">Unassigned</p>
									)}
								</div>

								{projectMembersLoading && (
									<div className="mt-4 text-sm text-slate-400">Loading project members...</div>
								)}

								{projectMembersError && !projectMembersLoading && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{projectMembersError}
									</div>
								)}

								{!projectMembersLoading && !projectMembersError && (
									<div className="mt-4 flex flex-col gap-3 sm:flex-row">
										<select
											value={selectedAssigneeId}
											onChange={(event) => setSelectedAssigneeId(event.target.value)}
											className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										>
											<option value="">Select a project member</option>
											{projectMembers.map((member) => (
												<option key={member.userId} value={member.userId}>
													{member.username} ({member.email})
												</option>
											))}
										</select>
										<button
											type="button"
											onClick={() => void handleAssignTask()}
											disabled={assigningTask || projectMembers.length === 0}
											className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{assigningTask ? 'Assigning...' : 'Assign'}
										</button>
									</div>
								)}

								{assignmentError && (
									<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{assignmentError}
									</div>
								)}
							</Card>

							<Card className="order-2 lg:col-start-1 lg:row-start-2">
								<SectionHeader title="Comments" description="Discuss this task with project members." />

								<form className="mt-6 space-y-3" onSubmit={handleCreateComment}>
									<textarea
										id="comment-content"
										value={commentText}
										onChange={(event) => setCommentText(event.target.value)}
										placeholder="Write a comment"
										maxLength={1000}
										rows={4}
										className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
									/>

									{commentSubmitError && (
										<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
											{commentSubmitError}
										</div>
									)}

									<button
										type="submit"
										disabled={submittingComment}
										className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{submittingComment ? 'Adding...' : 'Add comment'}
									</button>
								</form>

								{commentsLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading comments...</div>
								)}

								{commentsError && !commentsLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{commentsError}
									</div>
								)}

								{commentDeleteError && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{commentDeleteError}
									</div>
								)}

								{!commentsLoading && !commentsError && comments.length === 0 && (
									<EmptyState className="mt-6" title="No comments yet" description="Start the conversation by adding the first comment." />
								)}

								{!commentsLoading && !commentsError && comments.length > 0 && (
									<div className="mt-6 space-y-3">
										{comments.map((comment) => (
											<CommentCard
												key={comment.id}
												comment={comment}
												onDelete={currentUserId === comment.author.id ? () => void handleDeleteComment(comment.id) : undefined}
												isDeleting={deletingCommentId === comment.id}
											/>
										))}
									</div>
								)}
							</Card>

							<Card className="order-3 lg:col-start-1 lg:row-start-3">
								<SectionHeader title="Activity" description="Recent changes and updates for this task." />

								{activitiesLoading && (
									<div className="mt-6 text-sm text-slate-400">Loading activity...</div>
								)}

								{activitiesError && !activitiesLoading && (
									<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{activitiesError}
									</div>
								)}

								{!activitiesLoading && !activitiesError && activities.length === 0 && (
									<EmptyState className="mt-6" title="No activity yet" description="Task changes will appear here as they happen." />
								)}

								{!activitiesLoading && !activitiesError && activities.length > 0 && (
									<div className="mt-6 space-y-3">
										{activities.map((activity) => (
											<ActivityItem key={activity.id} activity={activity} />
										))}
									</div>
								)}
							</Card>

							<CollapsiblePanel className="order-6 lg:col-start-2 lg:row-start-3" title="Settings" description="Update this task’s details and status." variant="muted">
								<form className="space-y-4" onSubmit={handleUpdateTask}>
									<div>
										<label htmlFor="task-title" className="text-sm font-medium text-slate-200">
											Task title
										</label>
										<input
											id="task-title"
											type="text"
											value={taskTitle}
											onChange={(event) => setTaskTitle(event.target.value)}
											maxLength={100}
											required
											className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										/>
									</div>

									<div>
										<label htmlFor="task-description" className="text-sm font-medium text-slate-200">
											Description
										</label>
										<textarea
											id="task-description"
											value={taskDescription}
											onChange={(event) => setTaskDescription(event.target.value)}
											maxLength={500}
											rows={4}
											className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										/>
									</div>

									<div>
										<label htmlFor="task-status" className="text-sm font-medium text-slate-200">
											Status
										</label>
										<select
											id="task-status"
											value={taskStatus}
											onChange={(event) => setTaskStatus(event.target.value as TaskStatus)}
											className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
										>
											<option value="TODO">TODO</option>
											<option value="IN_PROGRESS">IN_PROGRESS</option>
											<option value="DONE">DONE</option>
										</select>
									</div>

									{taskSaveError && (
										<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
											{taskSaveError}
										</div>
									)}

									<button
										type="submit"
										disabled={savingTask}
										className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{savingTask ? 'Saving...' : 'Save changes'}
									</button>
								</form>
							</CollapsiblePanel>

							<CollapsiblePanel className="order-7 lg:col-start-2 lg:row-start-4" title="Danger zone" description="Permanently delete this task." variant="danger">
								{taskDeleteError && (
									<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{taskDeleteError}
									</div>
								)}

								<button
									type="button"
									onClick={() => void handleDeleteTask()}
									disabled={deletingTask}
									className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{deletingTask ? 'Deleting...' : 'Delete task'}
								</button>
							</CollapsiblePanel>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
