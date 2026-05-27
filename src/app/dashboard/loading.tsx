export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 border-r bg-gray-50 p-4 md:block">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}
