import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [config, setConfig] = useState(null)
  const [payments, setPayments] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchAll() {
    const [configRes, pmtsRes, adjsRes] = await Promise.all([
      supabase.from('config').select('*').single(),
      supabase.from('payments').select('*').order('date', { ascending: true }),
      supabase.from('adjustments').select('*').order('date', { ascending: true }),
    ])

    if (configRes.error || pmtsRes.error || adjsRes.error) {
      setError('Failed to load data. Check Supabase connection.')
      setLoading(false)
      return
    }

    setConfig(configRes.data)
    setPayments(pmtsRes.data ?? [])
    setAdjustments(adjsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  if (loading) return (
    <div style={{ color: 'var(--cyan)', padding: '2rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
      LOADING...
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
    </div>
  )
}

export default App
