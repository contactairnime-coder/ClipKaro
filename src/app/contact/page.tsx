"use client"

import { useState } from "react"
import Link from "next/link"
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
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you soon.")
    setForm({ name: "", email: "", message: "" })
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="text-xl font-bold">ClipKaro</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:underline">← Back to Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2 text-gray-500">Have a question? We would love to hear from you.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Get in Touch</h2>
            <div className="mt-4 space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p>contact@clipkaro.in</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Social</p>
                <p>@clipkaro on Instagram, Twitter, YouTube</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Response Time</p>
                <p>We typically respond within 24 hours</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        <p>Made in India 🇮🇳 — © 2024 ClipKaro</p>
      </footer>
    </div>
  )
}
