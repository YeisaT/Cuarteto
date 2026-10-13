import { useMemo, useState } from 'react'
import { Modal, PageHeader } from '../../components/ui'
import { useData } from '../../context/DataContext'

const emptyForm = {
  id: null,
  razonSocial: '',
  nit: '',
  tipo: 'local',
  pais: 'Bolivia',
  ciudad: '',
  telefono: '',
  email: '',
  representante: '',
  activo: true,
  productosOfrecidos: [],
}

export default function ProveedoresPage() {
  const { listProveedores, saveProveedor, toggleProveedor, catalogos } = useData()
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [prodPick, setProdPick] = useState('')
  const [costoRef, setCostoRef] = useState('')
  const [monedaProd, setMonedaProd] = useState('bob')

  const proveedores = listProveedores()

  const filtered = useMemo(() => {
    return proveedores.filter((p) => {
      const matchQ =
        !q ||
        [p.razonSocial, p.nit, p.ciudad, p.representante]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      const matchTipo = tipo === 'todos' || p.tipo === tipo
      return matchQ && matchTipo
    })
  }, [proveedores, q, tipo])

  const openNew = () => {
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (p) => {
    setForm({ ...p, productosOfrecidos: [...(p.productosOfrecidos || [])] })
    setOpen(true)
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const addProducto = () => {
    if (!prodPick || !costoRef) return
    setForm((f) => ({
      ...f,
      productosOfrecidos: [
        ...f.productosOfrecidos.filter((x) => x.productoId !== prodPick),
        {
          productoId: prodPick,
          costoReferencial: Number(costoRef),
          monedaId: monedaProd,
        },
      ],
    }))
    setProdPick('')
    setCostoRef('')
  }

  const removeProducto = (productoId) => {
    setForm((f) => ({
      ...f,
      productosOfrecidos: f.productosOfrecidos.filter((x) => x.productoId !== productoId),
    }))
  }

  const onSave = (e) => {
    e.preventDefault()
    saveProveedor(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Proveedores"
        subtitle="Catálogo de proveedores locales e internacionales, con costos referenciales."
        actions={
          <button type="button" className="btn btn-primary" onClick={openNew}>
            Nuevo proveedor
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Buscar por razón social, NIT, ciudad…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todos">Todos los tipos</option>
          <option value="local">Local</option>
          <option value="internacional">Internacional</option>
        </select>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Razón social</th>
                <th>Tipo</th>
                <th>NIT / ID</th>
                <th>Ciudad</th>
                <th>Representante</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No hay proveedores con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.razonSocial}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.tipo}</td>
                    <td>{p.nit}</td>
                    <td>
                      {p.ciudad}, {p.pais}
                    </td>
                    <td>{p.representante}</td>
                    <td>
                      <span className={`badge ${p.activo ? 'ok' : 'neutral'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="toolbar" style={{ margin: 0 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => toggleProveedor(p.id)}
                        >
                          {p.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        title={form.id ? 'Editar proveedor' : 'Nuevo proveedor'}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={onSave}>
          <div className="form-grid">
            <div className="field full">
              <label>Razón social</label>
              <input
                required
                value={form.razonSocial}
                onChange={(e) => setField('razonSocial', e.target.value)}
              />
            </div>
            <div className="field">
              <label>NIT / Identificación</label>
              <input required value={form.nit} onChange={(e) => setField('nit', e.target.value)} />
            </div>
            <div className="field">
              <label>Tipo</label>
              <select value={form.tipo} onChange={(e) => setField('tipo', e.target.value)}>
                <option value="local">Local</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
            <div className="field">
              <label>País</label>
              <input value={form.pais} onChange={(e) => setField('pais', e.target.value)} />
            </div>
            <div className="field">
              <label>Ciudad</label>
              <input value={form.ciudad} onChange={(e) => setField('ciudad', e.target.value)} />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => setField('telefono', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </div>
            <div className="field full">
              <label>Representante</label>
              <input
                value={form.representante}
                onChange={(e) => setField('representante', e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', margin: '1.2rem 0 0.6rem' }}>
            Productos y costos referenciales
          </h3>
          <div className="toolbar">
            <select value={prodPick} onChange={(e) => setProdPick(e.target.value)}>
              <option value="">Producto…</option>
              {catalogos.productos.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.codigo} — {pr.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Costo ref."
              value={costoRef}
              onChange={(e) => setCostoRef(e.target.value)}
              style={{ width: 120 }}
            />
            <select value={monedaProd} onChange={(e) => setMonedaProd(e.target.value)}>
              {catalogos.monedas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.codigo}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addProducto}>
              Agregar
            </button>
          </div>
          <div className="table-wrap panel" style={{ marginTop: '0.5rem' }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Costo ref.</th>
                  <th>Moneda</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(form.productosOfrecidos || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty">
                      Sin productos asociados.
                    </td>
                  </tr>
                ) : (
                  form.productosOfrecidos.map((item) => {
                    const prod = catalogos.productos.find((p) => p.id === item.productoId)
                    const mon = catalogos.monedas.find((m) => m.id === item.monedaId)
                    return (
                      <tr key={item.productoId}>
                        <td>{prod?.nombre}</td>
                        <td>{item.costoReferencial}</td>
                        <td>{mon?.codigo}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeProducto(item.productoId)}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
