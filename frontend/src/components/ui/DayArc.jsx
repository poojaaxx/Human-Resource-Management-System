import { motion } from 'framer-motion'

/**
 * Signature visual motif for Alignt: a workday rendered as an arc.
 * Progress sweeps from sunrise (left) to sunset (right), used across
 * stat cards, the auth hero, and profile rings to tie the product's
 * name — "every workday, perfectly aligned" — to a recurring shape.
 */
export default function DayArc({
  value = 0,
  size = 88,
  strokeWidth = 8,
  color = '#F2A93B',
  trackColor = 'rgba(20,22,31,0.08)',
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius // half circle
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference - (clamped / 100) * circumference
  const cx = size / 2
  const cy = radius + strokeWidth / 2

  const arcPath = (r) =>
    `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`

  return (
    <div className="relative" style={{ width: size, height: size / 2 + strokeWidth }}>
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <path
          d={arcPath(radius)}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.path
          d={arcPath(radius)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <circle cx={cx - radius} cy={cy} r={strokeWidth / 2.6} fill={color} opacity={0.5} />
        <circle cx={cx + radius} cy={cy} r={strokeWidth / 2.6} fill={trackColor} />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center leading-none">
          {label && <span className="font-display text-lg font-semibold text-ink-900">{label}</span>}
          {sublabel && <span className="text-[10px] uppercase tracking-wide text-ink-300">{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
