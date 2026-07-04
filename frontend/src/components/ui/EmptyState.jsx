export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-ink-900/10 bg-white/60 px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sunrise-50 text-sunrise-500">
          <Icon size={22} />
        </span>
      )}
      <p className="font-display text-base font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-300">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
