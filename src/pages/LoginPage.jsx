import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { USUARIOS_DEMO } from '../data/seed'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('compras@cuarteto.market')
  const [password, setPassword] = useState('compras123')
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/" replace />

  const onSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/')
  }

  const fillDemo = (user) => {
    const full = USUARIOS_DEMO.find((u) => u.id === user.id)
    setEmail(full.email)
    setPassword(full.password)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-login">
          <h1>CUARTETO-MARKET</h1>
          <p>Acceso al sistema de compra, venta e inventario</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="btn btn-primary">
            Ingresar
          </button>
        </form>
        <div className="demo-accounts">
          Cuentas demo (clic para completar):
          {USUARIOS_DEMO.map((u) => (
            <button key={u.id} type="button" onClick={() => fillDemo(u)}>
              {u.nombre} · {u.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
