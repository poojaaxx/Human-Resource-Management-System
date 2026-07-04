import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value = 0, duration = 900, className = '' }) {
  const [display, setDisplay] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = Number(value) || 0

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration])

  return <span className={className}>{display.toLocaleString()}</span>
}
