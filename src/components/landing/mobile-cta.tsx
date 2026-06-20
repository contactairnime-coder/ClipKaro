"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--ink)]/95 backdrop-blur-xl border-t border-[rgba(244,243,237,0.09)] p-3">
      <Link
        href="/signup"
        className="btn btn-primary w-full justify-center"
      >
        Join Free
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
