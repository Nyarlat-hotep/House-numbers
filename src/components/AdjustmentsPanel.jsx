import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-')
  const d = new Date(year, month - 1)
  return d.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function emptyForm() {
  return { date: '', amount: '', notes: '' }
}

export default function AdjustmentsPanel({ adjustments, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  function openEdit(adj) {
    setEditing(adj)
    setForm({
      date: adj.date,
      amount: String(Math.abs(adj.amount)),
      notes: adj.notes ?? '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    const payload = {
      date: form.date,
      amount: -Math.abs(parseFloat(form.amount)),
      notes: form.notes || null,
    }
    if (editing) {
      await supabase.from('adjustments').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('adjustments').insert(payload)
    }
    setShowModal(false)
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this adjustment?')) return
    await supabase.from('adjustments').delete().eq('id', id)
    onRefresh()
  }

  const total = adjustments.reduce((s, a) => s + Number(a.amount), 0)

  return (
    <div className="panel">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>Appraisal Adjustments</div>
        <button className="btn" onClick={openAdd}>+ Add Adjustment</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map(a => (
            <tr key={a.id}>
              <td>{formatDate(a.date)}</td>
              <td className="amount-negative">${Number(a.amount).toLocaleString()}</td>
              <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{a.notes ?? '—'}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Del</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ paddingTop: '0.75rem', color: 'var(--text-dim)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>TOTAL ADJUSTMENTS</td>
            <td style={{ paddingTop: '0.75rem' }} className="amount-negative">${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <Modal title={editing ? 'Edit Adjustment' : 'Add Adjustment'} onClose={() => setShowModal(false)}>
          <div className="form-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Reduction Amount ($)</label>
            <input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 204" />
          </div>
          <div className="form-field">
            <label>Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="modal-actions">
            <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
