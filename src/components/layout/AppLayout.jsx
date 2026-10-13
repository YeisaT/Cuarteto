import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { NAV_SECTIONS } from '../../config/navigation'
import { ROLES } from '../../config/roles'
import { useAuth } from '../../context/AuthContext'

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M14 42V22l10 8 8-12 8 10 10-14v28H14z"
        fill="#E8B84A"
        opacity="0.95"
      />
      <circle cx="46" cy="20" r="4" fill="#F5F7F6" />
    </svg>
  )
}

function Sidebar() {
  const { user, rol, can, logout } = useAuth()
  const [collapsed, setCollapsed] = useState({})

  const sections = useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => can(item.module)),
      })).filter((section) => {
        if (section.module && !can(section.module)) return false
        return section.items.length > 0
      }),
    [can],
  )

  const toggle = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <BrandMark />
        </div>
        <div className="brand-text">
          <strong>CUARTETO-MARKET</strong>
          <span>SRL · Sistema integral</span>
        </div>
      </div>

      <nav aria-label="Navegación principal">
        {sections.map((section) => {
          const isOpen = !collapsed[section.id]
          return (
            <div className="nav-section" key={section.id}>
              {section.label ? (
                <button
                  type="button"
                  className={`nav-heading ${isOpen ? 'open' : ''}`}
                  onClick={() => toggle(section.id)}
                >
                  {section.label}
                  <span className="chev">▾</span>
                </button>
              ) : null}
              {isOpen || !section.label ? (
                <div className="nav-items">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={Boolean(item.end)}
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="user-chip">
          <strong>{user?.nombre}</strong>
          <span>{rol?.nombre}</span>
        </div>
        <p className="offline-note">
          Ventas: guardado local offline previsto. Compras requieren conexión activa.
        </p>
        <button type="button" className="btn btn-ghost btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function titleFromPath(pathname) {
  const map = {
    '/': 'Dashboard general',
    '/compras': 'Compras · Dashboard',
    '/compras/proveedores': 'Compras · Proveedores',
    '/compras/ordenes': 'Compras · Órdenes',
    '/compras/pagos': 'Compras · Pagos',
    '/compras/reportes': 'Compras · Reportes',
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith('/compras/ordenes/')) return 'Compras · Detalle de orden'
  if (pathname.startsWith('/ventas')) return 'Ventas'
  if (pathname.startsWith('/inventario')) return 'Inventario'
  if (pathname.startsWith('/parametros')) return 'Parámetros'
  if (pathname.startsWith('/seguridad')) return 'Seguridad'
  return 'CUARTETO-MARKET'
}

export default function AppLayout() {
  const location = useLocation()
  const { switchRole, user } = useAuth()

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">{titleFromPath(location.pathname)}</div>
          <div className="topbar-actions">
            <label className="field" style={{ margin: 0 }}>
              <span className="sr-only" style={{ position: 'absolute', left: -9999 }}>
                Simular rol
              </span>
              <select
                value={user?.rolId || ''}
                onChange={(e) => switchRole(e.target.value)}
                title="Simular rol (demo)"
                aria-label="Simular rol"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    Rol: {r.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
