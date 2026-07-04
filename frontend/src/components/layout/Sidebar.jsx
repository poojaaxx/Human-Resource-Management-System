import { NavLink } from 'react-router-dom'
import { LayoutGrid, Users, ShieldCheck, CalendarCheck, CalendarClock, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ROLE_LABEL = { ADMIN: 'Admin', HR: 'HR', EMPLOYEE: 'Employee' }

export default function Sidebar({ open, onNavigate }) {
  const { user, isAdmin, isHr, logout } = useAuth()

  const nav = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
    // Employees directory is HR/Admin only — plain Employees never see coworkers' records.
    (isAdmin || isHr) && { to: '/employees', label: 'Employees', icon: Users },
    isAdmin && { to: '/hr-accounts', label: 'HR accounts', icon: ShieldCheck },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/leaves', label: 'Leave requests', icon: CalendarClock },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ].filter(Boolean)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-900 text-ink-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2.5 px-6 py-6">
        <svg width="30" height="18" viewBox="0 0 64 40" fill="none">
          <path d="M8 30 A18 18 0 0 1 44 30" stroke="#F2A93B" strokeWidth="5" strokeLinecap="round" />
          <circle cx="44" cy="30" r="3.5" fill="#FF6452" />
        </svg>
        <div>
          <p className="font-display text-lg font-semibold leading-none text-white">Alignt</p>
          <p className="text-[11px] leading-none text-ink-300 mt-1">HRMS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-ink-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunrise-400/20 font-display text-sm font-semibold text-sunrise-300">
            {(user?.fullName || user?.email || '?').slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.fullName || user?.email}</p>
            <p className="truncate text-xs text-ink-300">{ROLE_LABEL[user?.role] || 'Employee'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-dusk-400"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
