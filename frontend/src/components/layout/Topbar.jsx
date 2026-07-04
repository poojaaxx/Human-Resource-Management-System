import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Topbar({ title, subtitle, onMenuClick }) {
  const now = useClock()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-900/5 bg-paper/80 px-5 py-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-900/5 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">{title}</h1>
          {subtitle && <p className="text-sm text-ink-300">{subtitle}</p>}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-mono text-sm font-medium text-ink-900">{time}</p>
        <p className="text-xs text-ink-300">{date}</p>
      </div>
    </header>
  )
}
