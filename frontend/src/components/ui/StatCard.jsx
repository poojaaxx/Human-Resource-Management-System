import { motion } from 'framer-motion'
import DayArc from './DayArc'
import CountUp from './CountUp'

export default function StatCard({ title, value, percent, color = '#F2A93B', icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-xl2 border border-ink-900/5 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-300">{title}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink-900">
            <CountUp value={value} />
          </p>
        </div>
        {Icon && (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}1A`, color }}
          >
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
      </div>
      {typeof percent === 'number' && (
        <div className="mt-3 flex items-center justify-center">
          <DayArc value={percent} size={72} strokeWidth={6} color={color} />
        </div>
      )}
    </motion.div>
  )
}
