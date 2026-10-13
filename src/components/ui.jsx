export function StatusBadge({ estado, estados }) {
  const meta = estados.find((e) => e.id === estado) || {
    nombre: estado,
    tone: 'neutral',
  }
  return <span className={`badge ${meta.tone}`}>{meta.nombre}</span>
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="toolbar" style={{ margin: 0 }}>{actions}</div> : null}
    </header>
  )
}

export function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal ${wide ? 'wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function PlaceholderPage({ title, moduleName, note }) {
  return (
    <div className="panel panel-pad placeholder-page">
      <div className="icon">{moduleName?.[0] || '?'}</div>
      <h1 style={{ fontSize: '1.6rem' }}>{title}</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '42ch', margin: '0.75rem auto 0' }}>
        Vista placeholder del módulo <strong>{moduleName}</strong>. Lista para que el grupo
        asignado conecte su implementación aquí.
      </p>
      {note ? (
        <p className="alert info" style={{ marginTop: '1.25rem', textAlign: 'left' }}>
          {note}
        </p>
      ) : null}
    </div>
  )
}

export function formatMoney(amount, moneda) {
  const n = Number(amount) || 0
  const formatted = n.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${moneda?.simbolo || ''} ${formatted}`.trim()
}
