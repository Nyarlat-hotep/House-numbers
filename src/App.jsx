import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    async function fetchBalance() {
      const { data: config } = await supabase.from('config').select('initial_appraisal').single()
      const { data: payments } = await supabase.from('payments').select('amount')
      const { data: adjustments } = await supabase.from('adjustments').select('amount')

      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
      const totalAdjusted = adjustments.reduce((sum, a) => sum + Number(a.amount), 0)
      const remaining = Number(config.initial_appraisal) + totalAdjusted - totalPaid

      setBalance(remaining)
    }
    fetchBalance()
  }, [])

  return <div>{balance !== null ? `Balance: $${balance.toLocaleString()}` : 'Loading...'}</div>
}

export default App
