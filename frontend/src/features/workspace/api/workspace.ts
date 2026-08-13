import client from '../../../api/client'
import type { Project, ProjectStatus } from '../../project/types/Project'
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
