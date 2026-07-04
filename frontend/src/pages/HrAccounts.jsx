import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Mail, Briefcase, Phone, MapPin, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { getHrStaff, updateEmployee } from '../api/employees'
import { extractErrorMessage } from '../api/client'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import DepartmentSelect from '../components/ui/DepartmentSelect'

const EMPTY_FORM = { name: '', email: '', department: '', designation: '', salary: '', phone: '', address: '' }

export default function HrAccounts() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getHrStaff()
      .then(setStaff)
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load HR accounts.')))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openEdit(person) {
    setEditing(person)
    setForm({
      name: person.name || '',
      email: person.email || '',
      department: person.department || '',
      designation: person.designation || '',
      salary: person.salary ?? '',
      phone: person.phone || '',
      address: person.address || '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    const payload = { ...form, salary: form.salary === '' ? null : Number(form.salary) }
    try {
      await updateEmployee(editing.id, payload)
      toast.success('HR account updated')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save this account.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink-900">HR accounts</h2>
        <p className="text-sm text-ink-300">
          People with HR access — kept separate from the employee directory. Full edit access, admin-only.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading HR accounts…" />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No HR accounts yet"
          description="Accounts created with the HR role will show up here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {staff.map((person, i) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              className="group rounded-xl2 border border-ink-900/5 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 font-display text-base font-semibold text-white">
                    {person.name?.slice(0, 1).toUpperCase() || '?'}
                  </span>
                  <div>
                    <p className="font-medium text-ink-900">{person.name}</p>
                    <p className="text-xs text-ink-300">{person.designation}</p>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(person)}
                  className="focus-ring rounded-full p-1.5 text-ink-300 opacity-0 transition-opacity hover:bg-ink-50 hover:text-ink-900 group-hover:opacity-100"
                  aria-label={`Edit ${person.name}`}
                >
                  <Pencil size={15} />
                </button>
              </div>

              <div className="mt-4 space-y-2 border-t border-ink-900/5 pt-3 text-sm text-ink-500">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-ink-300" /> {person.email}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={14} className="text-ink-300" /> {person.department}
                </p>
                {person.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-ink-300" /> {person.phone}
                  </p>
                )}
                {person.address && (
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-ink-300" /> {person.address}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit HR account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <DepartmentSelect
                value={form.department}
                onChange={(v) => setForm((f) => ({ ...f, department: v }))}
              />
            </Field>
            <Field label="Designation">
              <input
                required
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </Field>
            <Field label="Address">
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </Field>
          </div>
          <Field label="Annual salary (optional)">
            <input
              type="number"
              min="0"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-ink-500 hover:bg-ink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="focus-ring rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-600">{label}</label>
      {children}
    </div>
  )
}
