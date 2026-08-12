import client from '../../../api/client'
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
