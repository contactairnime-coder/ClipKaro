"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Scissors, Wallet, Megaphone, Users, TrendingUp } from "lucide-react"

const clipperSteps = [
  {
    icon: Search,
    title: "Campaign Dhundo",
    desc: "Live campaigns browse karo, dekho kaun ₹ per 1000 views de raha hai, aur apni niche chuno.",
  },
  {
    icon: Scissors,
    title: "Clip Banao",
    desc: "Long video se best 30–60 second moment nikaalo — CapCut, InShot ya jo bhi tool chale.",
  },
  {
    icon: Wallet,
    title: "Paisa Kamao",
    desc: "Apne hi account se post karo. Views badhte hi payout automatic calculate hokar wallet mein aata hai.",
  },
]

const creatorSteps = [
  {
    icon: Megaphone,
    title: "Campaign Banao",
    desc: "Apna video upload karo, bounty set karo, aur campaign launch karo 5 minute mein.",
  },
  {
    icon: Users,
    title: "Clippers Kaam Karein",
    desc: "Hazaron clippers aapka content viral karenge simultaneously — free mein distribution.",
  },
  {
    icon: TrendingUp,
    title: "Viral Dekho",
    desc: "Views aate hi results dikhte hain. Aap sirf performance ke liye pay karte ho.",
  },
]

export function HowItWorksSection() {
  const [tab, setTab] = useState<"clipper" | "creator">("clipper")
  const steps = tab === "clipper" ? clipperSteps : creatorSteps

  return (
    <section className="how wrap" id="how">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sec-head"
      >
        <span className="eyebrow">The Process</span>
        <h2>Kaise Kaam Karta Hai?</h2>
        <p>Teen steps. Koi negotiation calls nahi — bas campaign chuno, clip banao, paisa lo.</p>
      </motion.div>

      <div className="toggle">
        <div className="toggle-inner">
          <button className={tab === "clipper" ? "active" : ""} onClick={() => setTab("clipper")}>
            Clipper Hoon
          </button>
          <button className={tab === "creator" ? "active" : ""} onClick={() => setTab("creator")}>
            Creator Hoon
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="steps"
        >
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="step"
              >
                <div className="step-icon">
                  <Icon className="w-6 h-6" style={{ color: "var(--gold)" }} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
