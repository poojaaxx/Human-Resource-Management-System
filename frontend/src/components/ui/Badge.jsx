const STYLES = {
  PENDING: 'bg-sunrise-50 text-sunrise-600 ring-1 ring-inset ring-sunrise-200',
  APPROVED: 'bg-sage-50 text-sage-600 ring-1 ring-inset ring-sage-100',
  REJECTED: 'bg-dusk-50 text-dusk-600 ring-1 ring-inset ring-dusk-100',
  ADMIN: 'bg-ink-900 text-white',
  EMPLOYEE: 'bg-ink-100 text-ink-600',
  PRESENT: 'bg-sage-50 text-sage-600 ring-1 ring-inset ring-sage-100',
  ABSENT: 'bg-dusk-50 text-dusk-600 ring-1 ring-inset ring-dusk-100',
  'HALF-DAY': 'bg-sunrise-50 text-sunrise-600 ring-1 ring-inset ring-sunrise-200',
  LEAVE: 'bg-ink-100 text-ink-500',
}

export default function Badge({ children, tone }) {
  const key = (tone || children || '').toString().toUpperCase()
  const style = STYLES[key] || 'bg-ink-100 text-ink-500'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>
      {children?.toString().toLowerCase()}
    </span>
  )
}
