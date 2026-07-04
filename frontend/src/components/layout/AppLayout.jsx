import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const TITLES = {
  '/': { title: 'Dashboard', subtitle: 'A snapshot of how the org is doing today' },
  '/employees': { title: 'Employees', subtitle: 'Manage profiles, roles and departments' },
  '/attendance': { title: 'Attendance', subtitle: 'Track check-ins across the week' },
  '/leaves': { title: 'Leave requests', subtitle: 'Apply, review and track time off' },
  '/profile': { title: 'Profile', subtitle: 'Your details on record' },
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const meta = TITLES[location.pathname] || { title: 'Alignt', subtitle: '' }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-5 py-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
