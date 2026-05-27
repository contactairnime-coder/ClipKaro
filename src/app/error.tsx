"use client"

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <span className="text-6xl">⚠️</span>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-500">An unexpected error occurred. Please try again.</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
