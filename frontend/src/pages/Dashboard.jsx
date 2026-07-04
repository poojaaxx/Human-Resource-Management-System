import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, Clock3, CheckCircle2, XCircle, CalendarClock, ArrowUpRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import toast from 'react-hot-toast'
import { getDashboard } from '../api/dashboard'
import { extractErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/ui/StatCard'
import Loader from '../components/ui/Loader'

const COLORS = { Pending: '#F2A93B', Approved: '#3FA796', Rejected: '#FF6452' }

export default function Dashboard() {
  const { user, isAdmin, isHr } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load dashboard data.')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Pulling today's numbers…" />

  const total = data?.totalLeaves || 0
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

  const chartData = [
    { name: 'Pending', value: data?.pendingLeaves || 0 },
    { name: 'Approved', value: data?.approvedLeaves || 0 },
    { name: 'Rejected', value: data?.rejectedLeaves || 0 },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink-300">
          {greeting}, {user?.fullName?.split(' ')[0] || 'there'}
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink-900">Here's the state of play</h2>
      </div>

      <div className={`grid grid-cols-2 gap-4 ${isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <StatCard title="Employees" value={data?.totalEmployees || 0} icon={Users} color="#14161F" delay={0} />
        {isAdmin && (
          <StatCard
            title="HR staff"
            value={data?.totalHrStaff || 0}
            icon={ShieldCheck}
            color="#5C5F79"
            delay={0.02}
          />
        )}
        <StatCard
          title="Pending leaves"
          value={data?.pendingLeaves || 0}
          percent={pct(data?.pendingLeaves)}
          icon={Clock3}
          color="#F2A93B"
          delay={0.05}
        />
        <StatCard
          title="Approved leaves"
          value={data?.approvedLeaves || 0}
          percent={pct(data?.approvedLeaves)}
          icon={CheckCircle2}
          color="#3FA796"
          delay={0.1}
        />
        <StatCard
          title="Rejected leaves"
          value={data?.rejectedLeaves || 0}
          percent={pct(data?.rejectedLeaves)}
          icon={XCircle}
          color="#FF6452"
          delay={0.15}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="rounded-xl2 border border-ink-900/5 bg-white p-6 shadow-soft lg:col-span-3"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-ink-900">Leave requests breakdown</h3>
              <p className="text-sm text-ink-300">{total} total requests filed</p>
            </div>
            <Link
              to="/leaves"
              className="focus-ring flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-sunrise-500"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {total === 0 ? (
            <p className="py-10 text-center text-sm text-ink-300">No leave requests yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(20,22,31,0.08)' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col gap-3 lg:col-span-2"
        >
          <QuickAction
            to="/leaves"
            icon={CalendarClock}
            title="Review leave requests"
            description="Approve or decline pending time off"
            color="#F2A93B"
          />
          {(isAdmin || isHr) && (
            <QuickAction
              to="/employees"
              icon={Users}
              title="Manage employees"
              description={isAdmin ? 'Add new hires or update records' : 'Assign departments to your team'}
              color="#3FA796"
            />
          )}
          {isAdmin && (
            <QuickAction
              to="/hr-accounts"
              icon={ShieldCheck}
              title="Manage HR accounts"
              description="Edit HR profiles and departments"
              color="#5C5F79"
            />
          )}
          <QuickAction
            to="/attendance"
            icon={CheckCircle2}
            title="Check attendance"
            description="See who's checked in today"
            color="#FF6452"
          />
        </motion.div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, title, description, color }) {
  return (
    <Link
      to={to}
      className="focus-ring group flex items-center gap-4 rounded-xl2 border border-ink-900/5 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink-900">{title}</p>
        <p className="truncate text-sm text-ink-300">{description}</p>
      </div>
      <ArrowUpRight size={16} className="text-ink-300 transition-colors group-hover:text-ink-900" />
    </Link>
  )
}
