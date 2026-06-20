"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { faqs } from "@/lib/landing-data"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="faq wrap" id="faq">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sec-head"
      >
        <span className="eyebrow">FAQ</span>
        <h2>Sawaal Jawab</h2>
      </motion.div>

      <div>
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`faq-item ${openIndex === i ? "open" : ""}`}
          >
            <div className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              {faq.q}
              <span className="plus">
                <ChevronDown className="w-[18px] h-[18px]" />
              </span>
            </div>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{ maxHeight: 240, opacity: 1 }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="faq-a"
                >
                  <div className="faq-a-inner">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
