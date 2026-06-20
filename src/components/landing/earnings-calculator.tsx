"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { topClippers } from "@/lib/landing-data"

function fmtINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN")
}

export function EarningsCalculatorSection() {
  const [clips, setClips] = useState(5)
  const [views, setViews] = useState(10)

  const monthly = clips * views * 60 * 5

  return (
    <section className="calc wrap" id="earnings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sec-head"
        style={{ marginBottom: "48px" }}
      >
        <span className="eyebrow">For Clippers</span>
        <h2>Kitna Kama Sakte Ho?</h2>
        <p>
          Apni daily output aur reach ke hisaab se estimate nikaalo. Ye sirf andaza hai — real
          earning views aur campaign rate par depend karti hai.
        </p>
      </motion.div>

      <div className="calc-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="panel"
        >
          <h3>Earnings Calculator</h3>
          <div className="slider-block">
            <div className="slider-top">
              <span>Daily clips banate ho?</span>
              <span className="val">{clips} Clips</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={clips}
              onChange={(e) => setClips(Number(e.target.value))}
            />
            <div className="slider-range">
              <span>1</span>
              <span>20</span>
            </div>
          </div>
          <div className="slider-block">
            <div className="slider-top">
              <span>Avg views per clip?</span>
              <span className="val">{views}K Views</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={views}
              onChange={(e) => setViews(Number(e.target.value))}
            />
            <div className="slider-range">
              <span>1K</span>
              <span>100K</span>
            </div>
          </div>
          <div className="result-box">
            <div className="amt">{fmtINR(monthly)}/mo</div>
            <div className="lbl">
              Monthly earning estimate · Top clippers earn ₹1,50,000+/month
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="panel"
        >
          <h3>Top Clippers This Month</h3>
          {topClippers.map((c) => (
            <div key={c.name} className="leader-row">
              <div
                className="avatar"
                style={{ background: c.bg }}
              >
                {c.initial}
              </div>
              <div>
                <div className="name">{c.name}</div>
                <div className="meta">{c.meta}</div>
              </div>
              <div className="amount">{c.amount}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
