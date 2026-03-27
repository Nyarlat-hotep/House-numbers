import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Pencil, Trash2 } from 'lucide-react'
import Modal from './Modal'

function emptyForm() {
  return { name: '', monthly_cost: '', notes: '' }
}

export default function UtilitiesPanel({ utilities, config, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [appraisalInput, setAppraisalInput] = useState(String(config?.initial_appraisal ?? ''))
  const [editingAppraisal, setEditingAppraisal] = useState(false)

  useEffect(() => {
    setAppraisalInput(String(config?.initial_appraisal ?? ''))
  }, [config])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  function openEdit(u) {
    setEditing(u)
    setForm({ name: u.name, monthly_cost: String(u.monthly_cost), notes: u.notes ?? '' })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name || !form.monthly_cost || isNaN(parseFloat(form.monthly_cost))) return
    const payload = {
      name: form.name,
      monthly_cost: parseFloat(form.monthly_cost),
      notes: form.notes || null,
    }
    const { error } = editing
      ? await supabase.from('utilities').update(payload).eq('id', editing.id)
      : await supabase.from('utilities').insert(payload)
    if (error) { alert('Failed to save utility. Please try again.'); return }
    setShowModal(false)
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this utility?')) return
    await supabase.from('utilities').delete().eq('id', id)
    onRefresh()
  }

  async function handleAppraisalSave() {
    if (!appraisalInput || isNaN(parseFloat(appraisalInput))) return
    const { error } = await supabase.from('config').update({ initial_appraisal: parseFloat(appraisalInput) }).eq('id', 1)
    if (error) { alert('Failed to save appraisal amount. Please try again.'); return }
    setEditingAppraisal(false)
    onRefresh()
  }

  return (
    <>
      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div className="panel-title" style={{ marginBottom: 0 }}>Utilities Reference</div>
          <button className="btn" onClick={openAdd}>+ Add Utility</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Utility</th>
              <th>Full Cost</th>
              <th>Your Share (½)</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {utilities.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>${Number(u.monthly_cost).toLocaleString()}</td>
                <td className="amount-positive">${(Number(u.monthly_cost) / 2).toLocaleString()}</td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{u.notes ?? '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn-icon" style={{ color: 'var(--cyan)' }} onClick={() => openEdit(u)}><Pencil size={14} /></button>
                    <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <Modal title={editing ? 'Edit Utility' : 'Add Utility'} onClose={() => setShowModal(false)}>
            <div className="form-field">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Monthly Cost ($)</label>
              <input type="number" value={form.monthly_cost} onChange={e => setForm(f => ({ ...f, monthly_cost: e.target.value }))} />
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

      <div className="panel">
        <div className="panel-title">Settings</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.1em', }}>Starting Appraisal</span>
          {editingAppraisal ? (
            <>
              <input
                type="number"
                value={appraisalInput}
                onChange={e => setAppraisalInput(e.target.value)}
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--cyan)', padding: '0.4rem', fontFamily: 'var(--font-mono)', width: '160px' }}
              />
              <button className="btn" onClick={handleAppraisalSave}>Save</button>
              <button className="btn btn-danger" onClick={() => setEditingAppraisal(false)}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>${Number(config?.initial_appraisal ?? 0).toLocaleString()}</span>
              <button className="btn" onClick={() => setEditingAppraisal(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
