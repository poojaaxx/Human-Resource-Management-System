import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loginUser, registerUser } from '../api/auth'
import { getMyEmployee } from '../api/employees'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem('hrms_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(true)

  // Every account has exactly one linked Employee record — the backend
  // auto-provisions it on registration (or on first fetch here) if HR
  // hasn't already created one for this email.
  const linkEmployeeRecord = useCallback(async (baseUser) => {
    try {
      const employee = await getMyEmployee()
      const enriched = { ...baseUser, employee }
      localStorage.setItem('hrms_user', JSON.stringify(enriched))
      setUser(enriched)
      return enriched
    } catch {
      setUser(baseUser)
      return baseUser
    }
  }, [])

  useEffect(() => {
    const existing = readStoredUser()
    if (existing) {
      linkEmployeeRecord(existing).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async (email, password) => {
      const res = await loginUser({ email, password })
      localStorage.setItem('hrms_token', res.token)
      const baseUser = { email: res.email, role: res.role, fullName: res.email.split('@')[0] }
      return linkEmployeeRecord(baseUser)
    },
    [linkEmployeeRecord]
  )

  const register = useCallback(
    async (fullName, email, password, role) => {
      const res = await registerUser({ fullName, email, password, role })
      localStorage.setItem('hrms_token', res.token)
      const baseUser = { email: res.email, role: res.role, fullName }
      return linkEmployeeRecord(baseUser)
    },
    [linkEmployeeRecord]
  )

  const refreshEmployeeLink = useCallback(() => {
    if (user) return linkEmployeeRecord(user)
    return Promise.resolve(null)
  }, [user, linkEmployeeRecord])

  const logout = useCallback(() => {
    localStorage.removeItem('hrms_token')
    localStorage.removeItem('hrms_user')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isHr = user?.role === 'HR'

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      isHr,
      // Convenience flag for capabilities HR and Admin share (leave approval,
      // attendance oversight) — distinct from isAdmin/isHr where the two differ
      // (department editing, Employees-directory personal-detail edits).
      canManage: isAdmin || isHr,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshEmployeeLink,
    }),
    [user, loading, isAdmin, isHr, login, register, logout, refreshEmployeeLink]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
