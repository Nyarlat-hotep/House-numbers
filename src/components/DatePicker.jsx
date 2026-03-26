import './DatePicker.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const YEARS = Array.from({ length: 12 }, (_, i) => 2020 + i) // 2020–2031

function daysInMonth(year, month) {
  if (!year || !month) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

export default function DatePicker({ value, onChange }) {
  const parts = value ? value.split('-') : ['', '', '']
  const year = parts[0] || ''
  const month = parts[1] || ''
  const day = parts[2] || ''

  const maxDay = daysInMonth(year, month)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)

  function update(y, m, d) {
    if (!y || !m || !d) return
    // clamp day if month/year change shrinks max days
    const max = daysInMonth(y, m)
    const clamped = String(Math.min(Number(d), max)).padStart(2, '0')
    onChange(`${y}-${m}-${clamped}`)
  }

  return (
    <div className="date-picker">
      <select value={month} onChange={e => update(year, e.target.value, day || '01')}>
        <option value="">Month</option>
        {MONTHS.map((name, i) => {
          const val = String(i + 1).padStart(2, '0')
          return <option key={val} value={val}>{name}</option>
        })}
      </select>
      <select value={day} onChange={e => update(year, month || '01', e.target.value)}>
        <option value="">Day</option>
        {days.map(d => {
          const val = String(d).padStart(2, '0')
          return <option key={val} value={val}>{d}</option>
        })}
      </select>
      <select value={year} onChange={e => update(e.target.value, month || '01', day || '01')}>
        <option value="">Year</option>
        {YEARS.map(y => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  )
}
