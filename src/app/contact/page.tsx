"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields")
      return
    }
    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to send")
      }
      toast.success("Message sent! We'll get back to you soon.")
      setForm({ name: "", email: "", message: "" })
    } catch {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

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
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-gray-500">Have a question? We would love to hear from you.</p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Get in Touch</h2>
              <div className="mt-4 space-y-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p>contact.airnime@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Social</p>
                  <p>@Clipr on Instagram, Twitter, YouTube</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Response Time</p>
                  <p>We typically respond within 24 hours</p>
                </div>
              </div>
            </div>

            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border p-2.5 text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border p-2.5 text-sm" placeholder="your@email.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border p-2.5 text-sm" placeholder="How can we help?" />
              </div>
              <button type="submit" disabled={sending} className="w-full rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {sending ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          </div>
        </main>
      </motion.div>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        <p>Made in India — © 2026 Clipr</p>
      </footer>
    </div>
  )
}
