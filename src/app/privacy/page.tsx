"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            <span className="text-xl font-bold">Clipr</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:underline">← Back to Home</Link>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: December 2024</p>

          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
              <p className="mt-2">We collect information you provide directly to us, including your name, email address, and UPI ID when you create an account. We also collect data about your usage of the platform, including submissions, view counts, and earnings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
              <p className="mt-2">We use your information to operate the Clipr platform, process payments, prevent fraud, improve our services, and communicate with you about your account and campaigns.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Payment Information</h2>
              <p className="mt-2">Payment processing is handled by Razorpay. We do not store your full payment details. UPI IDs are stored only for processing payouts.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
              <p className="mt-2">We implement industry-standard security measures to protect your data, including encryption in transit and at rest, and regular security audits.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
              <p className="mt-2">You can access, update, or delete your account data at any time. Contact us at contact.airnime@gmail.com for data deletion requests.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Contact</h2>
              <p className="mt-2">For privacy-related inquiries, email us at contact.airnime@gmail.com.</p>
            </section>
          </div>
        </main>
      </motion.div>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        <p>Made in India — © 2026 Clipr</p>
      </footer>
    </div>
  )
}
