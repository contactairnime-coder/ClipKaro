import Image from "next/image"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Image src="/logo.png" alt="Clipr" width={48} height={48} className="mx-auto w-12 h-12 animate-pulse" />
        <p className="mt-4 text-sm text-gray-500">Loading Clipr...</p>
      </div>
    </div>
  )
}
