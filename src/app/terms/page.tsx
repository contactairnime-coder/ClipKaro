"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: December 2024</p>

          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
              <p className="mt-2">By using Clipr, you agree to these terms. If you do not agree, do not use the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Eligibility</h2>
              <p className="mt-2">You must be at least 18 years old and a resident of India to use Clipr. You must have a valid UPI ID to receive payments.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Platform Rules</h2>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>No fake views or engagement farming</li>
                <li>No copyrighted content without permission</li>
                <li>No spam or duplicate submissions</li>
                <li>No abusive or inappropriate content</li>
                <li>One account per user</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Payments & Fees</h2>
              <p className="mt-2">Creators pay a 15% platform fee on top of the bounty amount. Clippers receive earnings based on verified view counts. Minimum withdrawal is ₹500.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Fraud Policy</h2>
              <p className="mt-2">Any attempt to manipulate view counts, submit fake data, or game the system will result in immediate account suspension and forfeiture of all earnings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
              <p className="mt-2">Clipr is not responsible for any losses arising from the use of the platform. We provide the platform as-is and may modify or discontinue services at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Contact</h2>
              <p className="mt-2">For any questions, contact us at contact.airnime@gmail.com.</p>
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
