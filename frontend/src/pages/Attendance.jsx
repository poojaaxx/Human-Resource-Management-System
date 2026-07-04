import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, LogOut, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getMyAttendance, checkIn as checkInApi, checkOut as checkOutApi, setDayStatus } from '../api/attendance'
import { extractErrorMessage } from '../api/client'
import Badge from '../components/ui/Badge'
import Loader from '../components/ui/Loader'

const STATUS_CYCLE = ['PRESENT', 'ABSENT', 'HALF-DAY', 'LEAVE', null]
const DOT_COLOR = {
  PRESENT: '#3FA796',
  ABSENT: '#FF6452',
  'HALF-DAY': '#F2A93B',
  LEAVE: '#5C5F79',
}

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

function formatTime(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Attendance() {
  const { canManage } = useAuth()
  const [records, setRecords] = useState({})
  const [checkIn, setCheckIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const load = useCallback(() => {
    setLoading(true)
    getMyAttendance()
      .then((rows) => {
        const map = {}
        let todayCheckIn = null
        for (const row of rows) {
          map[row.date] = row.status
          if (row.date === todayStr) todayCheckIn = formatTime(row.checkInTime)
        }
        setRecords(map)
        setCheckIn(todayCheckIn)
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load attendance.')))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const days = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    return cells
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey(today)])

  async function handleCheckIn() {
    try {
      const res = await checkInApi()
      const time = formatTime(res.checkInTime)
      setRecords((r) => ({ ...r, [todayStr]: 'PRESENT' }))
      setCheckIn(time)
      toast.success(`Checked in at ${time}`)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not check in.'))
    }
  }

  async function handleCheckOut() {
    try {
      await checkOutApi()
      setCheckIn(null)
      toast.success('Checked out — see you tomorrow')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not check out.'))
    }
  }

  async function cycleStatus(dateStr) {
    if (!canManage) return
    const current = records[dateStr] || null
    const idx = STATUS_CYCLE.indexOf(current)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    try {
      await setDayStatus(dateStr, next)
      setRecords((r) => {
        const copy = { ...r }
        if (next === null) delete copy[dateStr]
        else copy[dateStr] = next
        return copy
      })
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not update that day.'))
    }
  }

  const monthLabel = today.toLocaleDateString([], { month: 'long', year: 'numeric' })
  const summary = Object.values(records).reduce(
    (acc, status) => ({ ...acc, [status]: (acc[status] || 0) + 1 }),
    {}
  )

  if (loading) return <Loader label="Loading attendance…" />

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl2 border border-ink-900/5 bg-white p-6 shadow-soft"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-ink-300">Today</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink-900">
            {today.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-ink-500">
            <Clock size={15} />
            {checkIn ? `Checked in at ${checkIn}` : 'Not checked in yet'}
          </div>

          {!canManage && (
            <button
              onClick={checkIn ? handleCheckOut : handleCheckIn}
              className={`focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] ${
                checkIn ? 'bg-dusk-500 hover:bg-dusk-600' : 'bg-ink-900'
              }`}
            >
              {checkIn ? <LogOut size={16} /> : <LogIn size={16} />}
              {checkIn ? 'Check out' : 'Check in'}
            </button>
          )}

          <div className="mt-6 space-y-2 border-t border-ink-900/5 pt-4">
            {Object.entries(DOT_COLOR).map(([status, color]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {status.toLowerCase()}
                </span>
                <span className="font-mono text-ink-900">{summary[status] || 0}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl2 border border-ink-900/5 bg-white p-6 shadow-soft lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-900">{monthLabel}</h3>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-ink-300">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {days.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />
              const dateStr = date.toISOString().slice(0, 10)
              const status = records[dateStr]
              const isToday = dateStr === todayStr
              return (
                <button
                  key={dateStr}
                  onClick={() => cycleStatus(dateStr)}
                  disabled={!canManage}
                  className={`focus-ring relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                    isToday ? 'ring-1 ring-ink-900/20' : ''
                  } ${canManage ? 'hover:bg-ink-900/5' : ''}`}
                  style={{ backgroundColor: status ? `${DOT_COLOR[status]}1A` : 'transparent' }}
                >
                  <span className={isToday ? 'font-semibold text-ink-900' : 'text-ink-500'}>{date.getDate()}</span>
                  {status && (
                    <span
                      className="mt-0.5 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: DOT_COLOR[status] }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          {!canManage && Object.keys(records).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-900/5 pt-4">
              {Object.entries(records)
                .sort((a, b) => (a[0] < b[0] ? 1 : -1))
                .slice(0, 6)
                .map(([date, status]) => (
                  <div key={date} className="flex items-center gap-2 rounded-lg bg-ink-50 px-2.5 py-1 text-xs">
                    <span className="text-ink-400">{date.slice(5)}</span>
                    <Badge tone={status}>{status}</Badge>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
