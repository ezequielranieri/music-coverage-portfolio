export default function RootLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 bg-surface-card border-b border-surface-border" />
      <div className="max-w-[1240px] mx-auto px-4 pt-4 pb-6 space-y-6">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-24 h-24 rounded-full bg-surface-border" />
          <div className="h-6 w-48 rounded bg-surface-border" />
          <div className="h-4 w-32 rounded bg-surface-border" />
          <div className="flex gap-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-surface-border" />
            ))}
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-surface-border shrink-0" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-surface-border" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-border" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-surface-border" />
          ))}
        </div>
      </div>
    </div>
  )
}
