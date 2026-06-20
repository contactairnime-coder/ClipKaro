"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { stats } from "@/lib/landing-data"

export function StatsBar() {
  return (
    <div className="wrap stats-bar">
      <div className="stats-card">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="stat-box"
          >
            <div className="num">
              <span className="text-[var(--gold)]">{s.value}</span>
            </div>
            <div className="lbl">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TrustBar() {
  return (
    <div className="wrap" style={{ marginTop: "40px", marginBottom: "40px" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[var(--surface)] border border-[rgba(244,243,237,0.12)] rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-dim)" }}>
            <ShieldCheck className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <span>Secured by</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-deep))" }}
              >
                <span className="text-[#1A1206] font-bold text-xs">R</span>
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--paper)" }}>
                Razorpay
              </span>
            </div>
            <div className="w-px h-6" style={{ background: "rgba(244,243,237,0.12)" }} />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6F7CF6, #4B57D6)" }}
              >
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--paper)" }}>
                Supabase
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: "var(--text-dim)" }}>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" style={{ color: "var(--gold)" }} />
              256-bit encrypted payments
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" style={{ color: "var(--gold)" }} />
              Instant UPI payouts
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
