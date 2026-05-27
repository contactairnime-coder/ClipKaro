"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            <span className="text-xl font-bold">ClipKaro</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:underline">← Back to Home</Link>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold">About ClipKaro</h1>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              ClipKaro ka mission hai Indian creators ki help karna. Hum chahte hain ki har creator aur clipper ko unki creativity ka sahi paisa mile. India mein thousands of talented editors hain jo viral content bana sakte hain — ClipKaro unhe platform deta hai apni skills se paisa kamane ka.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">What is ClipKaro?</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              ClipKaro India ka pehla clipping platform hai. Yahan creators apne long-form videos ke liye bounty campaigns create karte hain. Clippers in campaigns se clips banate hain, submit karte hain, aur views ke hisaab se ₹ kamate hain. Yeh creators ko free marketing deta hai aur clippers ko earning opportunity.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Our Team</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { name: "Karan Soni", role: "Founder & CEO", initial: "K" },
                { name: "Team ClipKaro", role: "Building the Future", initial: "C" },
              ].map((member) => (
                <div key={member.name} className="rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                    {member.initial}
                  </div>
                  <h3 className="mt-3 font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </motion.div>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        <p>Made in India — © 2024 ClipKaro</p>
      </footer>
    </div>
  )
}
