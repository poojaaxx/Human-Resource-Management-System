import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Briefcase, Building2, IndianRupee, Phone, MapPin, ShieldCheck, Info, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { updateMyContact } from '../api/employees'
import { extractErrorMessage } from '../api/client'
import DayArc from '../components/ui/DayArc'

export default function Profile() {
  const { user, canManage, refreshEmployeeLink } = useAuth()
  const emp = user?.employee
  const [extra, setExtra] = useState({ name: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setExtra({ name: emp?.name || '', phone: emp?.phone || '', address: emp?.address || '' })
  }, [emp])

  async function handleSave(e) {
    e.preventDefault()
    if (!emp) return
    setSaving(true)
    try {
      await updateMyContact(extra)
      await refreshEmployeeLink()
      setSaved(true)
      toast.success('Profile updated')
      setTimeout(() => setSaved(false), 1500)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save your profile'))
    } finally {
      setSaving(false)
    }
  }

  const initials = (user?.fullName || user?.email || '?').slice(0, 1).toUpperCase()
  const now = new Date()
  const dayProgress = Math.round(((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100)

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl2 border border-ink-900/5 bg-white p-6 text-center shadow-soft"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ink-900 font-display text-2xl font-semibold text-white">
          {initials}
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-ink-900">
          {emp?.name || user?.fullName || user?.email}
        </p>
        <p className="text-sm text-ink-300">{emp?.designation || (canManage ? 'HR Officer' : 'Employee')}</p>

        <div className="mt-5 flex justify-center">
          <DayArc value={dayProgress} size={100} strokeWidth={7} label={`${dayProgress}%`} sublabel="Day's arc" />
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white">
          <ShieldCheck size={12} /> {user?.role}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-4 rounded-xl2 border border-ink-900/5 bg-white p-6 shadow-soft lg:col-span-2"
      >
        <h3 className="font-display text-base font-semibold text-ink-900">On record</h3>

        {!emp && (
          <div className="flex items-start gap-2.5 rounded-lg bg-sunrise-50 px-3.5 py-3 text-sm text-sunrise-700">
            <Info size={15} className="mt-0.5 shrink-0" />
            <p>Couldn't load your profile right now. Try refreshing the page.</p>
          </div>
        )}

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Detail icon={Mail} label="Email" value={emp?.email || user?.email} />
          <Detail icon={Building2} label="Department" value={emp?.department || '—'} />
          <Detail icon={Briefcase} label="Designation" value={emp?.designation || '—'} />
          <Detail
            icon={IndianRupee}
            label="Annual salary"
            value={emp?.salary != null ? Number(emp.salary).toLocaleString() : canManage ? '—' : 'Visible to HR only'}
          />
        </dl>

        <form onSubmit={handleSave} className="border-t border-ink-900/5 pt-5">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold text-ink-900">Your details</h4>
            <span className="text-xs text-ink-300">Saved to your account</span>
          </div>
          <p className="mb-3 text-xs text-ink-300">
            Name, phone and address are yours to update. Department, designation and salary are set by HR.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                <User size={14} /> Full name
              </label>
              <input
                required
                value={extra.name}
                onChange={(e) => setExtra({ ...extra, name: e.target.value })}
                placeholder="Your full name"
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                <Phone size={14} /> Phone
              </label>
              <input
                value={extra.phone}
                onChange={(e) => setExtra({ ...extra, phone: e.target.value })}
                placeholder="+91 90000 00000"
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                <MapPin size={14} /> Address
              </label>
              <input
                value={extra.address}
                onChange={(e) => setExtra({ ...extra, address: e.target.value })}
                placeholder="Coimbatore, Tamil Nadu"
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!emp || saving}
            className="focus-ring mt-4 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save details'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-300">
        <Icon size={13} /> {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink-900">{value}</dd>
    </div>
  )
}
