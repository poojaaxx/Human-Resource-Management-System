import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, ShieldCheck, User, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'
import AuthHero from '../components/AuthHero'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'EMPLOYEE' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await register(form.fullName, form.email, form.password, form.role)
      toast.success('Account created — welcome to Alignt!')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not create your account. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthHero />

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-sunrise-500">Get started</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-ink-300">Set up access in under a minute.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Full name</label>
              <input
                type="text"
                required
                autoFocus
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Sree K"
                className="focus-ring w-full rounded-lg border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Work email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="focus-ring w-full rounded-lg border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="focus-ring w-full rounded-lg border border-ink-900/10 bg-white px-3.5 py-2.5 pr-10 text-sm text-ink-900 placeholder:text-ink-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-300 hover:text-ink-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">You are joining as</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'EMPLOYEE', label: 'Employee', icon: User },
                  { value: 'HR', label: 'HR', icon: ShieldCheck },
                  { value: 'ADMIN', label: 'Admin', icon: Crown },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm({ ...form, role: value })}
                    className={`focus-ring flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                      form.role === value
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-900/10 bg-white text-ink-500 hover:border-ink-900/25'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="focus-ring group flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
              {!submitting && (
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-300">
            Already have an account?{' '}
            <Link to="/login" className="focus-ring font-semibold text-ink-900 hover:text-sunrise-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
