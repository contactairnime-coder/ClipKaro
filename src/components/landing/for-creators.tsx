"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Target, Users, Shield, TrendingUp } from "lucide-react"
import { creatorFeatures } from "@/lib/landing-data"

const iconMap: Record<string, React.ReactNode> = {
  target: <Target className="w-5 h-5" style={{ color: "var(--gold)" }} />,
  users: <Users className="w-5 h-5" style={{ color: "var(--gold)" }} />,
  shield: <Shield className="w-5 h-5" style={{ color: "var(--gold)" }} />,
  trending: <TrendingUp className="w-5 h-5" style={{ color: "var(--gold)" }} />,
}

export function ForCreatorsSection() {
  return (
    <section className="creator-sec" id="creators">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sec-head"
          style={{ marginBottom: 0 }}
        >
          <span className="eyebrow">For Creators</span>
          <h2>Apna Content Free Mein Viral Karwao</h2>
          <p>
            Hazaaron clippers aapke episodes, streams ya podcasts ko clips mein badal denge — aap
            sirf results pe pay karoge, effort pe nahi.
          </p>
        </motion.div>

        <div className="feat-grid">
          {creatorFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="feat-card"
            >
              <div className="feat-icon">{iconMap[f.icon]}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="creator-cta-row"
        >
          <Link href="/signup?role=creator" className="btn btn-primary btn-lg">
            Campaign 5 Minute Mein Launch Karo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
