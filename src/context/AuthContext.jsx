import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { ROLES, canAccess } from '../config/roles'
import { USUARIOS_DEMO } from '../data/seed'

const AuthContext = createContext(null)
const STORAGE_KEY = 'cm_auth_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = useCallback((email, password) => {
    const found = USUARIOS_DEMO.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!found) {
      return { ok: false, error: 'Credenciales incorrectas' }
    }
    const session = {
      id: found.id,
      nombre: found.nombre,
      email: found.email,
      rolId: found.rolId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const switchRole = useCallback((rolId) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, rolId }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(() => {
    const rol = ROLES.find((r) => r.id === user?.rolId) || null
    return {
      user,
      rol,
      isAuthenticated: Boolean(user),
      login,
      logout,
      switchRole,
      can: (moduleKey) => (user ? canAccess(user.rolId, moduleKey) : false),
      demoUsers: USUARIOS_DEMO.map(({ password, ...rest }) => rest),
    }
  }, [user, login, logout, switchRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
