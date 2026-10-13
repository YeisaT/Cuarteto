import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatMoney, StatusBadge } from '../components/ui'

export default function GeneralDashboard() {
  const { user, rol, can } = useAuth()
  const { dashboardStats, catalogos, getProveedor } = useData()
  const stats = dashboardStats()
  const bob = catalogos.monedas.find((m) => m.id === 'bob')

  return (
    <div>
      <PageHeader
        title="Dashboard general"
        subtitle={`Bienvenido/a, ${user?.nombre}. Rol activo: ${rol?.nombre}.`}
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Proveedores activos</div>
          <div className="value">{stats.proveedoresActivos}</div>
        </div>
        <div className="stat-card">
          <div className="label">OC pendientes</div>
          <div className="value">{stats.pendientes}</div>
        </div>
        <div className="stat-card">
          <div className="label">OC aprobadas</div>
          <div className="value">{stats.aprobadas}</div>
        </div>
        <div className="stat-card">
          <div className="label">Monto en curso</div>
          <div className="value" style={{ fontSize: '1.25rem' }}>
            {formatMoney(stats.montoPendiente, bob)}
          </div>
        </div>
      </div>

      <div className="panel panel-pad" style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Accesos rápidos</h2>
        <div className="toolbar">
          {can('compras') ? (
            <>
              <Link className="btn btn-primary" to="/compras">
                Ir a Compras
              </Link>
              <Link className="btn btn-ghost" to="/compras/ordenes/nueva">
                Nueva orden de compra
              </Link>
              <Link className="btn btn-ghost" to="/compras/proveedores">
                Proveedores
              </Link>
            </>
          ) : null}
          {can('ventas') ? (
            <Link className="btn btn-ghost" to="/ventas/notas">
              Ventas (próximamente)
            </Link>
          ) : null}
          {can('inventario') ? (
            <Link className="btn btn-ghost" to="/inventario/productos">
              Inventario (próximamente)
            </Link>
          ) : null}
        </div>
      </div>

      {can('compras') ? (
        <div className="panel">
          <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Órdenes recientes</h2>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Proveedor</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recientes.map((o) => (
                  <tr key={o.id}>
                    <td>{o.numero}</td>
                    <td>{getProveedor(o.proveedorId)?.razonSocial}</td>
                    <td>
                      <StatusBadge estado={o.estado} estados={catalogos.estadosOrden} />
                    </td>
                    <td>{o.fechaEntrega}</td>
                    <td>
                      <Link className="btn btn-ghost btn-sm" to={`/compras/ordenes/${o.id}`}>
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="alert info">
          Tu rol no tiene acceso al módulo de Compras. Usa el selector de rol en la barra
          superior para simular otro perfil, o inicia sesión con una cuenta autorizada.
        </div>
      )}
    </div>
  )
}
