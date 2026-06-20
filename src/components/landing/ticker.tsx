"use client"

import { useMemo } from "react"
import { tickerPayouts } from "@/lib/landing-data"

export function Ticker() {
  const items = useMemo(() => {
    const html: React.ReactNode[] = []
    for (let r = 0; r < 2; r++) {
      tickerPayouts.forEach(([name, amt], i) => {
        html.push(
          <div key={`${r}-${i}`} className="ticker-item">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0" />
            Payout sent to <b className="text-[var(--gold)] font-bold">{name}</b> —{" "}
            <b className="text-[var(--gold)] font-bold">{amt}</b>
          </div>
        )
      })
    }
    return html
  }, [])

  return (
    <div className="ticker-outer">
      <div className="ticker-track">{items}</div>
    </div>
  )
}
