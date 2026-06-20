"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="hero wrap">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="eyebrow"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0" />
        ₹4.2Cr+ already paid to Indian clippers
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Viral Karo.
        <br />
        <span className="accent">Paisa Kamao.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="sub"
      >
        Kisi bhi long video se 30-second ka clip banao, Reels ya Shorts pe daalo, aur views
        badhne ke saath seedha bank account mein paisa pao. Na audience chahiye, na experience —
        bas phone aur thoda content-sense.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hero-ctas"
      >
        <Link href="/signup" className="btn btn-primary btn-lg">
          Join as Clipper — Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/signup?role=creator" className="btn btn-ghost btn-lg">
          Launch a Campaign
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="risk-row"
      >
        <span>
          <Check className="w-3.5 h-3.5" />
          No credit card
        </span>
        <span>
          <Check className="w-3.5 h-3.5" />
          Free forever
        </span>
        <span>
          <Check className="w-3.5 h-3.5" />
          ₹500 se withdraw karo
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hero-shot-wrap"
      >
        <div className="device">
          <div className="device-screen">
            <div className="screen-topbar">
              <div className="screen-dot-row">
                <div className="screen-dot" />
                <div className="screen-dot" />
                <div className="screen-dot" />
              </div>
              <span className="font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                clipkaro.app/dashboard
              </span>
            </div>
            <div className="screen-grid">
              <div className="card-mini">
                <span className="font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  CLIP PERFORMANCE — 30D
                </span>
                <div className="bars">
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "55%" }} />
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "70%" }} />
                  <span style={{ height: "60%" }} />
                  <span style={{ height: "90%" }} />
                  <span style={{ height: "75%" }} />
                  <span style={{ height: "100%" }} />
                  <span style={{ height: "64%" }} />
                  <span style={{ height: "80%" }} />
                  <span style={{ height: "50%" }} />
                  <span style={{ height: "68%" }} />
                </div>
              </div>
              <div className="card-mini">
                <span className="font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  THIS MONTH
                </span>
                <div className="flex flex-col gap-3.5 mt-4">
                  <div>
                    <div
                      className="font-mono text-[22px] font-bold"
                      style={{ color: "var(--gold)" }}
                    >
                      ₹58,200
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      Total earned
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-mono text-[22px] font-bold"
                      style={{ color: "var(--indigo)" }}
                    >
                      2.4M
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      Total views
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-pill-row">
              <div className="stat-pill">
                <div className="v">12</div>
                <div className="l">CLIPS LIVE</div>
              </div>
              <div className="stat-pill">
                <div className="v">8.0%</div>
                <div className="l">ENGAGE RATE</div>
              </div>
              <div className="stat-pill">
                <div className="v">₹500</div>
                <div className="l">MIN PAYOUT</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
