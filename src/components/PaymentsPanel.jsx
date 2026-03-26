import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'
import './PaymentsPanel.css'

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-')
  const d = new Date(year, month - 1)
  return d.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function emptyForm() {
  return { date: '', amount: '', type: 'monthly', notes: '' }
}

export default function PaymentsPanel({ payments, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  function openEdit(payment) {
    setEditing(payment)
    setForm({
      date: payment.date,
      amount: String(payment.amount),
      type: payment.type,
      notes: payment.notes ?? '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    const payload = {
      date: form.date,
      amount: parseFloat(form.amount),
      type: form.type,
      notes: form.notes || null,
    }
    if (editing) {
      await supabase.from('payments').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('payments').insert(payload)
    }
    setShowModal(false)
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this payment?')) return
    await supabase.from('payments').delete().eq('id', id)
    onRefresh()
  }

  const total = payments.reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div className="panel payments-panel">
      <div className="panel-header">
        <div className="panel-title">Payments</div>
        <button className="btn" onClick={openAdd}>+ Add Payment</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{formatDate(p.date)}</td>
              <td className="amount-positive">${Number(p.amount).toLocaleString()}</td>
              <td><span className={`type-badge ${p.type}`}>{p.type}</span></td>
              <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{p.notes ?? '—'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Del</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={{ paddingTop: '0.75rem', color: 'var(--text-dim)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>TOTAL PAID</td>
            <td style={{ paddingTop: '0.75rem' }} className="amount-positive">${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <Modal title={editing ? 'Edit Payment' : 'Add Payment'} onClose={() => setShowModal(false)}>
          <div className="form-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Amount ($)</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="monthly">Monthly</option>
              <option value="adhoc">Ad Hoc</option>
            </select>
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
