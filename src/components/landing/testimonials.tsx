"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { testimonials } from "@/lib/landing-data"

export function TestimonialsSection() {
  return (
    <section className="testi wrap">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sec-head"
      >
        <span className="eyebrow">Real Results</span>
        <h2>Logon Ne Kya Kaha</h2>
        <p>12,000+ clippers already earning — kuch real stories.</p>
      </motion.div>

      <div className="testi-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="testi-card"
          >
            <div className="stars">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-[var(--gold)]" style={{ color: "var(--gold)" }} />
              ))}
            </div>
            <q>{t.text}</q>
            <div className="testi-who">
              <div
                className="avatar"
                style={{ background: t.bg, width: "34px", height: "34px", fontSize: "12px", color: "white" }}
              >
                {t.initial}
              </div>
              <div>
                <div className="name">{t.name}</div>
                <div className="role">
                  {t.city} · {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
