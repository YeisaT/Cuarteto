import { PageHeader } from '../../components/ui'
import { useData } from '../../context/DataContext'
import { formatMoney } from '../../components/ui'

export default function ComprasReportesPage() {
  const { listOrdenes, listPagos, getProveedor, catalogos, ordenTotal } = useData()
  const ordenes = listOrdenes()
  const pagos = listPagos()

  const porEstado = catalogos.estadosOrden.map((e) => ({
    ...e,
    count: ordenes.filter((o) => o.estado === e.id).length,
    monto: ordenes.filter((o) => o.estado === e.id).reduce((s, o) => s + ordenTotal(o), 0),
  }))

  const porProveedor = {}
  ordenes.forEach((o) => {
    porProveedor[o.proveedorId] = (porProveedor[o.proveedorId] || 0) + ordenTotal(o)
  })

  const bob = catalogos.monedas.find((m) => m.id === 'bob')

  return (
    <div>
      <PageHeader
        title="Reportes de compras"
        subtitle="Resumen por estado y proveedor. Base para reportes formales del backend."
      />

      <div className="stats-grid">
        {porEstado.map((e) => (
          <div className="stat-card" key={e.id}>
            <div className="label">{e.nombre}</div>
            <div className="value">{e.count}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Monto acumulado por proveedor</h2>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Monto (suma OC)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(porProveedor).map(([provId, monto]) => (
                <tr key={provId}>
                  <td>{getProveedor(provId)?.razonSocial}</td>
                  <td>{formatMoney(monto, bob)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel panel-pad">
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Total de pagos registrados: <strong>{pagos.length}</strong> ·{' '}
          {formatMoney(
            pagos.reduce((s, p) => s + Number(p.monto), 0),
            bob,
          )}
        </p>
      </div>
    </div>
  )
}
