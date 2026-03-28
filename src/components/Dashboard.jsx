import { LogOut } from 'lucide-react'
import './Dashboard.css'

function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Dashboard({ config, payments = [], adjustments = [], onSignOut }) {
  const initialAppraisal = Number(config?.initial_appraisal ?? 0)
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const totalAdjusted = adjustments.reduce((sum, a) => sum + Number(a.amount), 0)
  const remaining = initialAppraisal + totalAdjusted - totalPaid

  return (
    <div className="dashboard">
      <button className="signout-btn" onClick={onSignOut} title="Sign out">
        <LogOut size={14} />
      </button>
      <div className="dashboard-label">Remaining Balance</div>
      <div className="dashboard-balance">{fmt(remaining)}</div>
      <div className="dashboard-stats">
        <div className="stat">
          <span className="stat-label">Starting Appraisal</span>
          <span className="stat-value cyan">{fmt(initialAppraisal)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Paid</span>
          <span className="stat-value green">{fmt(totalPaid)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Adjustments</span>
          <span className="stat-value red">{fmt(totalAdjusted)}</span>
        </div>
      </div>
    </div>
  )
}
