import RDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'

export default function DatePicker({ value, onChange }) {
  const date = value ? new Date(value + 'T00:00:00') : null

  function handleChange(d) {
    if (!d) { onChange(''); return }
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    onChange(`${y}-${m}-${day}`)
  }

  return (
    <RDatePicker
      selected={date}
      onChange={handleChange}
      dateFormat="MMMM d, yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      placeholderText="Select a date..."
      className="datepicker-input"
      calendarClassName="datepicker-calendar"
      wrapperClassName="datepicker-wrapper"
    />
  )
}
