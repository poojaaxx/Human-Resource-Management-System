export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-300">
      <div className="relative h-8 w-8">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-ink-100 border-t-sunrise-400" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  )
}
