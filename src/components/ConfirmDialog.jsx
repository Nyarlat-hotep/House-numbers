import './Modal.css'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal--danger">
        <div className="modal-title" style={{ color: 'var(--red)' }}>Confirm Delete</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
