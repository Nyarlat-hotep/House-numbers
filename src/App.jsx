import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './components/Dashboard'
import PaymentsPanel from './components/PaymentsPanel'
import AdjustmentsPanel from './components/AdjustmentsPanel'
import UtilitiesPanel from './components/UtilitiesPanel'
import './App.css'

function App() {
  const [config, setConfig] = useState(null)
  const [payments, setPayments] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [utilities, setUtilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchAll() {
    const [configRes, pmtsRes, adjsRes, utilsRes] = await Promise.all([
      supabase.from('config').select('*').single(),
      supabase.from('payments').select('*').order('date', { ascending: true }),
      supabase.from('adjustments').select('*').order('date', { ascending: true }),
      supabase.from('utilities').select('*').order('name'),
    ])

    if (configRes.error || pmtsRes.error || adjsRes.error || utilsRes.error) {
      setError('Failed to load data. Check Supabase connection.')
      setLoading(false)
      return
    }

    setConfig(configRes.data)
    setPayments(pmtsRes.data ?? [])
    setAdjustments(adjsRes.data ?? [])
    setUtilities(utilsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  if (loading) return (
    <div style={{ color: 'var(--cyan)', padding: '2rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
      Loading...
    </div>
  )

  if (error) return (
    <div style={{ color: 'var(--red)', padding: '2rem', fontFamily: 'var(--font-mono)' }}>
      {error}
    </div>
  )

  return (
    <div className="app">
      <Dashboard config={config} payments={payments} adjustments={adjustments} />
      <PaymentsPanel payments={payments} onRefresh={fetchAll} />
      <AdjustmentsPanel adjustments={adjustments} onRefresh={fetchAll} />
      <UtilitiesPanel utilities={utilities} config={config} onRefresh={fetchAll} />
    </div>
  )
}

export default App
