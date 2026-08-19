import client from '../../../api/client'
import type { Activity } from '../../activity/types/Activity'
import type { Comment } from '../../comment/types/Comment'
import type { Notification } from '../../notification/types/Notification'
import type { Project, ProjectStatus } from '../../project/types/Project'
import type { ProjectMember } from '../../project/types/ProjectMember'
import type { Task, TaskStatus } from '../../task/types/Task'
import type { Workspace } from '../types/Workspace'
import type { WorkspaceMember } from '../types/WorkspaceMember'

export const getWorkspaces = async (): Promise<Workspace[]> => {
	const response = await client.get<Workspace[]>('/workspaces')
	return response.data
}

export const createWorkspace = async (data: { name: string; description?: string }): Promise<Workspace> => {
	const response = await client.post<Workspace>('/workspaces', data)
	return response.data
}

export const getWorkspace = async (id: number): Promise<Workspace> => {
	const response = await client.get<Workspace>(`/workspaces/${id}`)
	return response.data
}

export const updateWorkspace = async (
	workspaceId: number,
	data: { name: string; description?: string }
): Promise<Workspace> => {
	const response = await client.patch<Workspace>(`/workspaces/${workspaceId}`, data)
	return response.data
}

export const deleteWorkspace = async (workspaceId: number): Promise<void> => {
	await client.delete(`/workspaces/${workspaceId}`)
}

export const getWorkspaceProjects = async (workspaceId: number): Promise<Project[]> => {
	const response = await client.get<Project[]>(`/workspaces/${workspaceId}/projects`)
	return response.data
}

export const createWorkspaceProject = async (
	workspaceId: number,
	data: { name: string; description?: string }
): Promise<Project> => {
	const response = await client.post<Project>(`/workspaces/${workspaceId}/projects`, data)
	return response.data
}

export const getProject = async (id: number): Promise<Project> => {
	const response = await client.get<Project>(`/projects/${id}`)
	return response.data
}

export const updateProject = async (
	projectId: number,
	data: { name: string; description?: string; status: ProjectStatus }
): Promise<Project> => {
	const response = await client.patch<Project>(`/projects/${projectId}`, data)
	return response.data
}

export const deleteProject = async (projectId: number): Promise<void> => {
	await client.delete(`/projects/${projectId}`)
}

export const getProjectMembers = async (projectId: number): Promise<ProjectMember[]> => {
	const response = await client.get<ProjectMember[]>(`/projects/${projectId}/members`)
	return response.data
}

export const addProjectMember = async (projectId: number, email: string): Promise<ProjectMember> => {
	const response = await client.post<ProjectMember>(`/projects/${projectId}/members`, { email })
	return response.data
}

export const removeProjectMember = async (projectId: number, userId: number): Promise<void> => {
	await client.delete(`/projects/${projectId}/members/${userId}`)
}

export const getTask = async (id: number): Promise<Task> => {
	const response = await client.get<Task>(`/tasks/${id}`)
	return response.data
}

export const updateTask = async (
	taskId: number,
	data: { title: string; description?: string; status: TaskStatus }
): Promise<Task> => {
	const response = await client.patch<Task>(`/tasks/${taskId}`, data)
	return response.data
}

export const deleteTask = async (taskId: number): Promise<void> => {
	await client.delete(`/tasks/${taskId}`)
}

export const assignTask = async (taskId: number, userId: number): Promise<Task> => {
	const response = await client.put<Task>(`/tasks/${taskId}/assignee/${userId}`)
	return response.data
}

export const unassignTask = async (taskId: number): Promise<Task> => {
	const response = await client.delete<Task>(`/tasks/${taskId}/assignee`)
	return response.data
}

export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
	const response = await client.get<Task[]>(`/projects/${projectId}/tasks`)
	return response.data
}

export const createProjectTask = async (
	projectId: number,
	data: { title: string; description?: string }
): Promise<Task> => {
	const response = await client.post<Task>(`/projects/${projectId}/tasks`, data)
	return response.data
}

export const getTaskComments = async (taskId: number): Promise<Comment[]> => {
	const response = await client.get<Comment[]>(`/tasks/${taskId}/comments`)
	return response.data
}

export const createTaskComment = async (
	taskId: number,
	data: { content: string }
): Promise<Comment> => {
	const response = await client.post<Comment>(`/tasks/${taskId}/comments`, data)
	return response.data
}

export const deleteComment = async (commentId: number): Promise<void> => {
	await client.delete(`/comments/${commentId}`)
}

export const getTaskActivity = async (taskId: number): Promise<Activity[]> => {
	const response = await client.get<Activity[]>(`/tasks/${taskId}/activity`)
	return response.data
}

export const getNotifications = async (): Promise<Notification[]> => {
	const response = await client.get<Notification[]>('/notifications')
	return response.data
}

export const markNotificationAsRead = async (id: number): Promise<Notification> => {
	const response = await client.patch<Notification>(`/notifications/${id}/read`)
	return response.data
}

export const getWorkspaceMembers = async (workspaceId: number): Promise<WorkspaceMember[]> => {
	const response = await client.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`)
	return response.data
}

export const addWorkspaceMember = async (workspaceId: number, email: string): Promise<WorkspaceMember> => {
	const response = await client.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, { email })
	return response.data
}

export const removeWorkspaceMember = async (workspaceId: number, userId: number): Promise<void> => {
	await client.delete(`/workspaces/${workspaceId}/members/${userId}`)
}
