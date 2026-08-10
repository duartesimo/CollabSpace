import client from '../../../api/client'
import type { Workspace } from '../types/Workspace'

export const getWorkspaces = async (): Promise<Workspace[]> => {
	const response = await client.get<Workspace[]>('/workspaces')
	return response.data
}

export const createWorkspace = async (data: { name: string; description?: string }): Promise<Workspace> => {
	const response = await client.post<Workspace>('/workspaces', data)
	return response.data
}
