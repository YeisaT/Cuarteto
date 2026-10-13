import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge, formatMoney } from '../../components/ui'
import { useData } from '../../context/DataContext'

export default function OrdenesListPage() {
  const { listOrdenes, getProveedor, catalogos, ordenTotal } = useData()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('todos')

  const ordenes = listOrdenes()

  const filtered = useMemo(() => {
    return ordenes.filter((o) => {
      const prov = getProveedor(o.proveedorId)
      const matchQ =
        !q ||
        [o.numero, prov?.razonSocial, o.lugarEntrega]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      const matchEstado = estado === 'todos' || o.estado === estado
      return matchQ && matchEstado
    })
  }, [ordenes, q, estado, getProveedor])

  return (
    <div>
      <PageHeader
        title="Órdenes de compra"
        subtitle="Crear, listar, aprobar y dar seguimiento a órdenes de compra."
        actions={
          <Link className="btn btn-primary" to="/compras/ordenes/nueva">
            Nueva orden
          </Link>
        }
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Buscar por número o proveedor…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {catalogos.estadosOrden.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Número</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Moneda</th>
                <th>Total</th>
                <th>Entrega</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No hay órdenes con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const mon = catalogos.monedas.find((m) => m.id === o.monedaId)
                  return (
                    <tr key={o.id}>
                      <td>{o.numero}</td>
                      <td>{getProveedor(o.proveedorId)?.razonSocial}</td>
                      <td>
                        <StatusBadge estado={o.estado} estados={catalogos.estadosOrden} />
                      </td>
                      <td>{mon?.codigo}</td>
                      <td>{formatMoney(ordenTotal(o), mon)}</td>
                      <td>
                        {o.fechaEntrega} {o.horaEntrega}
                      </td>
                      <td>
                        <Link className="btn btn-ghost btn-sm" to={`/compras/ordenes/${o.id}`}>
                          Ver / gestionar
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
