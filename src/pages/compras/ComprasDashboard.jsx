import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge, formatMoney } from '../../components/ui'
import { useData } from '../../context/DataContext'

export default function ComprasDashboard() {
  const { dashboardStats, catalogos, getProveedor, ordenTotal } = useData()
  const stats = dashboardStats()
  const bob = catalogos.monedas.find((m) => m.id === 'bob')

  return (
    <div>
      <PageHeader
        title="Dashboard de Compras"
        subtitle="Resumen de proveedores, órdenes pendientes de aprobación y pagos registrados."
        actions={
          <>
            <Link className="btn btn-primary" to="/compras/ordenes/nueva">
              Nueva orden
            </Link>
            <Link className="btn btn-ghost" to="/compras/proveedores">
              Proveedores
            </Link>
          </>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Pendientes aprobación</div>
          <div className="value">{stats.pendientes}</div>
        </div>
        <div className="stat-card">
          <div className="label">Aprobadas</div>
          <div className="value">{stats.aprobadas}</div>
        </div>
        <div className="stat-card">
          <div className="label">Recibidas</div>
          <div className="value">{stats.recibidas}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pagos registrados</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            {formatMoney(stats.pagosMes, bob)}
          </div>
        </div>
      </div>

      <div className="alert warn">
        Las órdenes de compra requieren conexión activa. No se permiten compras offline.
      </div>

      <div className="panel">
        <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.15rem' }}>Últimas órdenes</h2>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Número</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Entrega</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.recientes.map((o) => {
                const mon = catalogos.monedas.find((m) => m.id === o.monedaId)
                return (
                  <tr key={o.id}>
                    <td>{o.numero}</td>
                    <td>{getProveedor(o.proveedorId)?.razonSocial}</td>
                    <td>
                      <StatusBadge estado={o.estado} estados={catalogos.estadosOrden} />
                    </td>
                    <td>{formatMoney(ordenTotal(o), mon)}</td>
                    <td>
                      {o.fechaEntrega} {o.horaEntrega}
                    </td>
                    <td>
                      <Link className="btn btn-ghost btn-sm" to={`/compras/ordenes/${o.id}`}>
                        Detalle
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
