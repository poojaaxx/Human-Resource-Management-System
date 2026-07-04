import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Mail, Briefcase, IndianRupee, Users, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getEmployees,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateDepartment,
} from '../api/employees'
import { extractErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import DepartmentSelect from '../components/ui/DepartmentSelect'

const EMPTY_FORM = { name: '', email: '', department: '', designation: '', salary: '' }

export default function Employees() {
  const { isAdmin, isHr, refreshEmployeeLink } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // HR can reassign an employee's department but can't touch anything else
  // about their record — a lighter modal than the admin's full edit form.
  const [deptTarget, setDeptTarget] = useState(null)
  const [deptValue, setDeptValue] = useState('')
  const [savingDept, setSavingDept] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getEmployees()
      .then(setEmployees)
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load employees.')))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return load()
    try {
      setLoading(true)
      setEmployees(await searchEmployees(query.trim()))
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Search failed.'))
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(emp) {
    setEditing(emp)
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      department: emp.department || '',
      designation: emp.designation || '',
      salary: emp.salary ?? '',
    })
    setModalOpen(true)
  }

  function openDeptEdit(emp) {
    setDeptTarget(emp)
    setDeptValue(emp.department || '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, salary: form.salary === '' ? null : Number(form.salary) }
    try {
      if (editing) {
        await updateEmployee(editing.id, payload)
        toast.success('Employee updated')
      } else {
        await createEmployee(payload)
        toast.success('Employee added')
      }
      setModalOpen(false)
      load()
      refreshEmployeeLink()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save this employee.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDeptSubmit(e) {
    e.preventDefault()
    if (!deptTarget) return
    setSavingDept(true)
    try {
      await updateDepartment(deptTarget.id, deptValue)
      toast.success('Department updated')
      setDeptTarget(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not update this department.'))
    } finally {
      setSavingDept(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEmployee(id)
      toast.success('Employee removed')
      setConfirmDelete(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not remove this employee.'))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => !query.trim() && load()}
            placeholder="Search by name…"
            className="focus-ring w-full rounded-lg border border-ink-900/10 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300"
          />
        </form>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
          >
            <Plus size={16} /> Add employee
          </button>
        )}
      </div>

      {loading ? (
        <Loader label="Loading employees…" />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees found"
          description={isAdmin ? 'Add your first employee to get started.' : 'Check back once HR adds records.'}
          action={
            isAdmin && (
              <button
                onClick={openCreate}
                className="focus-ring rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Add employee
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((emp, i) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              className="group rounded-xl2 border border-ink-900/5 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 font-display text-base font-semibold text-white">
                    {emp.name?.slice(0, 1).toUpperCase() || '?'}
                  </span>
                  <div>
                    <p className="font-medium text-ink-900">{emp.name}</p>
                    <p className="text-xs text-ink-300">{emp.designation}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEdit(emp)}
                        className="focus-ring rounded-full p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-900"
                        aria-label={`Edit ${emp.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(emp)}
                        className="focus-ring rounded-full p-1.5 text-ink-300 hover:bg-dusk-50 hover:text-dusk-500"
                        aria-label={`Delete ${emp.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                  {isHr && !isAdmin && (
                    <button
                      onClick={() => openDeptEdit(emp)}
                      className="focus-ring rounded-full p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-900"
                      aria-label={`Assign department for ${emp.name}`}
                    >
                      <Building2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-ink-900/5 pt-3 text-sm text-ink-500">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-ink-300" /> {emp.email}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={14} className="text-ink-300" /> {emp.department}
                </p>
                {emp.salary != null && (
                  <p className="flex items-center gap-2">
                    <IndianRupee size={14} className="text-ink-300" /> {Number(emp.salary).toLocaleString()} / yr
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit employee' : 'Add employee'}>
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
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deptTarget} onClose={() => setDeptTarget(null)} title="Assign department" width="max-w-sm">
        <form onSubmit={handleDeptSubmit} className="space-y-4">
          <p className="text-sm text-ink-500">
            Set the department for <span className="font-semibold text-ink-900">{deptTarget?.name}</span>.
          </p>
          <Field label="Department">
            <DepartmentSelect value={deptValue} onChange={setDeptValue} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeptTarget(null)}
              className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-ink-500 hover:bg-ink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingDept}
              className="focus-ring rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingDept ? 'Saving…' : 'Save department'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Remove employee" width="max-w-sm">
        <p className="text-sm text-ink-500">
          This will permanently remove <span className="font-semibold text-ink-900">{confirmDelete?.name}</span>{' '}
          from your records.
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

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-600">{label}</label>
      {children}
    </div>
  )
}
