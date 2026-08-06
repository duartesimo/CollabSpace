import React, { createContext, useCallback, useEffect, useState } from 'react'
import * as authApi from '../../api/auth'
import * as authStorage from './authStorage'

type AuthContextType = {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => authStorage.getToken())

  const login = useCallback(async (email: string, password: string) => {
    const t = await authApi.login(email, password)
    authStorage.setToken(t)
    setTokenState(t)
  }, [])

  const logout = useCallback(() => {
    authStorage.removeToken()
    setTokenState(null)
  }, [])

  const value: AuthContextType = {
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
