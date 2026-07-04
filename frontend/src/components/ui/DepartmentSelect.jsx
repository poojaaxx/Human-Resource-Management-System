import { useState } from 'react'

export const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Design', 'Finance', 'Operations', 'Marketing']

export default function DepartmentSelect({ value, onChange, disabled = false, required = true }) {
  const [customMode, setCustomMode] = useState(!!value && !DEPARTMENTS.includes(value))

  function handleSelect(e) {
    const next = e.target.value
    if (next === 'Other') {
      setCustomMode(true)
      onChange('')
    } else {
      setCustomMode(false)
      onChange(next)
    }
  }

  return (
    <div>
      <select
        required={required}
        disabled={disabled}
        value={customMode ? 'Other' : value}
        onChange={handleSelect}
        className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="" disabled>
          Select department…
        </option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
        <option value="Other">Other…</option>
      </select>
      {customMode && (
        <input
          required={required}
          disabled={disabled}
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter department"
          className="focus-ring mt-2 w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />
      )}
    </div>
  )
}
