import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentUser } from '../lib/users-api'
import type { User } from '../types/user'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('access_token')
  )

  const {
    data: user,
    isLoading,
    error,
  } = useCurrentUser()

  useEffect(() => {
    if (error) {
      // If there's an error fetching user data, likely the token is invalid
      localStorage.removeItem('access_token')
      setIsAuthenticated(false)
    } else if (user) {
      setIsAuthenticated(true)
    }
  }, [user, error])

  const logout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    window.location.href = '/login'
  }

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}