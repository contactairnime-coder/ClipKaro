"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export function FinalCTASection() {
  return (
    <div className="final-cta wrap">
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Aaj Hi Shuru Karo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Free join karo — koi monthly fee nahi. Apna pehla campaign abhi dhoondo aur clipping
          shuru karo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="final-ctas"
        >
          <Link href="/signup" className="btn btn-primary btn-lg">
            Join Free Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn btn-ghost btn-lg">
            Contact Support
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="risk-row"
          style={{ justifyContent: "center" }}
        >
          <span>
            <Check className="w-3.5 h-3.5" />
            No credit card
          </span>
          <span>
            <Check className="w-3.5 h-3.5" />
            2-minute signup
          </span>
          <span>
            <Check className="w-3.5 h-3.5" />
            Cancel anytime
          </span>
        </motion.div>
      </div>
    </div>
  )
}
