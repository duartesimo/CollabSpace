import client from './client'

export interface LoginResponse {
  token: string
}

export async function login(email: string, password: string): Promise<string> {
  const resp = await client.post<LoginResponse>('/auth/login', { email, password })
  return resp.data.token
}

export default { login }
