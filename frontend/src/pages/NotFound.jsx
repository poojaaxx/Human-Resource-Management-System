import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DayArc from '../components/ui/DayArc'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <DayArc value={0} size={120} strokeWidth={8} />
      </motion.div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">This page has clocked out</h1>
      <p className="max-w-sm text-sm text-ink-300">
        The page you're looking for doesn't exist, or has moved somewhere else.
      </p>
      <Link
        to="/"
        className="focus-ring rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
