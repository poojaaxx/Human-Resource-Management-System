import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, X, Trash2, CalendarClock, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAllLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
  deleteLeave,
} from '../api/leaves'
import { getEmployees } from '../api/employees'
import { extractErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']
const LEAVE_TYPES = ['Paid', 'Sick', 'Unpaid']

const EMPTY_FORM = { employeeId: '', employeeName: '', leaveType: 'Paid', startDate: '', endDate: '', reason: '' }

export default function Leaves() {
  const { canManage, user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [mineOnly, setMineOnly] = useState(!canManage)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    // Only HR/Admin can list the Employees directory server-side now — a plain
    // Employee only ever files leave for themselves, so they don't need it.
    const employeesPromise = canManage ? getEmployees() : Promise.resolve([])
    Promise.all([getAllLeaves(), employeesPromise])
      .then(([l, e]) => {
        setLeaves(l)
        setEmployees(e)
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load leave requests.')))
      .finally(() => setLoading(false))
  }, [canManage])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (user?.employee && !form.employeeId) {
      setForm((f) => ({ ...f, employeeId: user.employee.id, employeeName: user.employee.name }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const visibleLeaves = useMemo(() => {
    let list = leaves
    if (filter !== 'ALL') list = list.filter((l) => l.status === filter)
    if (mineOnly && user?.employee) list = list.filter((l) => l.employeeId === user.employee.id)
    return [...list].sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
  }, [leaves, filter, mineOnly, user])

  function openApply() {
    setForm({
      employeeId: user?.employee?.id || '',
      employeeName: user?.employee?.name || '',
      leaveType: 'Paid',
      startDate: '',
      endDate: '',
      reason: '',
    })
    setModalOpen(true)
  }

  function handlePickEmployee(id) {
    const emp = employees.find((e) => String(e.id) === String(id))
    setForm((f) => ({ ...f, employeeId: id, employeeName: emp?.name || '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.employeeId) {
      toast.error('Select which employee this request is for.')
      return
    }
    if (form.endDate < form.startDate) {
      toast.error('End date cannot be before the start date.')
      return
    }
    setSaving(true)
    try {
      await applyLeave({ ...form, employeeId: Number(form.employeeId) })
      toast.success('Leave request submitted')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not submit this request.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleApprove(id) {
    try {
      await approveLeave(id)
      toast.success('Leave approved')
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not approve this request.'))
    }
  }

  async function handleReject(id) {
    try {
      await rejectLeave(id)
      toast.success('Leave rejected')
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not reject this request.'))
    }
  }

  async function handleDelete(id) {
    try {
      await deleteLeave(id)
      toast.success('Request removed')
      setConfirmDelete(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not remove this request.'))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={15} className="text-ink-300" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-ink-900 text-white' : 'bg-white text-ink-500 hover:bg-ink-50'
              }`}
            >
              {f.toLowerCase()}
            </button>
          ))}
          {user?.employee && (
            <label className="ml-1 flex items-center gap-1.5 text-sm text-ink-500">
              <input
                type="checkbox"
                checked={mineOnly}
                onChange={(e) => setMineOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-ink-300 text-sunrise-500 focus:ring-sunrise-400"
              />
              My requests only
            </label>
          )}
        </div>
        <button
          onClick={openApply}
          className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
        >
          <Plus size={16} /> Apply for leave
        </button>
      </div>

      {loading ? (
        <Loader label="Loading leave requests…" />
      ) : visibleLeaves.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No leave requests here"
          description="Requests you apply for or that need review will show up in this list."
          action={
            <button onClick={openApply} className="focus-ring rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
              Apply for leave
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-900/5 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-300">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeaves.map((l, i) => (
                <motion.tr
                  key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.015]"
                >
                  <td className="px-5 py-3.5 font-medium text-ink-900">{l.employeeName}</td>
                  <td className="px-5 py-3.5 text-ink-500">{l.leaveType}</td>
                  <td className="px-5 py-3.5 text-ink-500">
                    {l.startDate} → {l.endDate}
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-3.5 text-ink-500" title={l.reason}>
                    {l.reason}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={l.status}>{l.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {canManage && l.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(l.id)}
                            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full text-sage-500 hover:bg-sage-50"
                            aria-label="Approve"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => handleReject(l.id)}
                            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full text-dusk-500 hover:bg-dusk-50"
                            aria-label="Reject"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {canManage && (
                        <button
                          onClick={() => setConfirmDelete(l)}
                          className="focus-ring flex h-7 w-7 items-center justify-center rounded-full text-ink-300 hover:bg-ink-50 hover:text-dusk-500"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Apply for leave">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Employee</label>
            {canManage ? (
              <select
                required
                value={form.employeeId}
                onChange={(e) => handlePickEmployee(e.target.value)}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              >
                <option value="" disabled>
                  Select employee record
                </option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.department}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-ink-900/10 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-500">
                Filing as {form.employeeName || user?.fullName || user?.email}
              </p>
            )}
            {canManage && !user?.employee && (
              <p className="mt-1.5 text-xs text-ink-300">
                We couldn't automatically match your account to an employee record — pick yours from the list.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Leave type</label>
            <div className="grid grid-cols-3 gap-2">
              {LEAVE_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm({ ...form, leaveType: t })}
                  className={`focus-ring rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.leaveType === t
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-900/10 bg-white text-ink-500 hover:border-ink-900/25'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Start date</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">End date</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Reason</label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="A short note for whoever reviews this"
              className="focus-ring w-full rounded-lg border border-ink-900/10 px-3.5 py-2.5 text-sm"
            />
          </div>

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
              {saving ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Remove leave request" width="max-w-sm">
        <p className="text-sm text-ink-500">
          Remove <span className="font-semibold text-ink-900">{confirmDelete?.employeeName}</span>'s{' '}
          {confirmDelete?.leaveType?.toLowerCase()} leave request?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setConfirmDelete(null)}
            className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-ink-500 hover:bg-ink-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(confirmDelete.id)}
            className="focus-ring rounded-lg bg-dusk-500 px-4 py-2 text-sm font-semibold text-white hover:bg-dusk-600"
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
