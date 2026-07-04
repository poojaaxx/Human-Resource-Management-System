import { motion } from 'framer-motion'
import DayArc from './ui/DayArc'

const now = new Date()
const progressThroughDay = Math.round(((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100)

const FEATURES = [
  { time: '9:02 AM', text: 'Priya checked in from Chennai' },
  { time: '11:40 AM', text: 'Leave request approved for Design team' },
  { time: '2:15 PM', text: 'Payroll synced for 48 employees' },
]

export default function AuthHero() {
  return (
    <div className="relative hidden overflow-hidden bg-ink-900 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sunrise-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sage-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="18" viewBox="0 0 64 40" fill="none">
            <path d="M8 30 A18 18 0 0 1 44 30" stroke="#F2A93B" strokeWidth="5" strokeLinecap="round" />
            <circle cx="44" cy="30" r="3.5" fill="#FF6452" />
          </svg>
          <span className="font-display text-lg font-semibold">Alignt</span>
        </div>

        <h2 className="mt-16 max-w-sm font-display text-4xl font-semibold leading-tight">
          Every workday,
          <br />
          perfectly aligned.
        </h2>
        <p className="mt-4 max-w-xs text-sm text-ink-200">
          One place for attendance, leave and payroll — built so HR spends less time on
          spreadsheets and more time on people.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mt-14 rounded-xl2 border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-300">Today's arc</p>
          <p className="font-mono text-xs text-ink-300">{progressThroughDay}%</p>
        </div>
        <div className="mt-3 flex justify-center">
          <DayArc value={progressThroughDay} size={160} strokeWidth={10} color="#F2A93B" />
        </div>
        <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
          {FEATURES.map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-xs text-ink-200">
              <span className="font-mono text-ink-400">{f.time}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
