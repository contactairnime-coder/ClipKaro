"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const sections = [
  { id: "how-it-works", label: "How it Works" },
  { id: "for-creators", label: "For Creators" },
  { id: "for-clippers", label: "For Clippers" },
  { id: "earnings", label: "Earnings" },
]

const faqs = [
  { q: "Clipping kya hota hai?", a: "Clipping ka matlab hota hai kisi bade video (long-form) se chhota, engaging clip banana aur social media par share karna. ClipKaro pe creators apne videos ke liye clippers ko bounty dete hain." },
  { q: "Kya yeh free hai join karna?", a: "Haan, bilkul free! ClipKaro join karna aur clipper banna completely free hai. Koi monthly fee, koi hidden charges nahi." },
  { q: "Payment kaise milega?", a: "Payment seedha aapke UPI ID par aata hai. Jab aapki clips views generate karengi, aapki earnings calculate hoti hai aur aap withdraw kar sakte hain." },
  { q: "Minimum withdrawal kitna hai?", a: "Minimum withdrawal ₹500 hai. Jaise hi aapki earnings ₹500 se zyada hoti hai, aap withdraw request kar sakte hain." },
  { q: "Kya fake views chalenge?", a: "Nahi! Hamara fraud detection system fake views catch karta hai. Agar koi fake views use karega, to uska account ban ho jayega aur payment nahi milegi." },
  { q: "Creator ban ne ke liye kya chahiye?", a: "Aapko bas apna YouTube/Instagram/TikTok channel chahiye. Koi minimum subscriber count nahi. Jo bhi creator hai, apna campaign bana sakta hai." },
  { q: "Kitne din mein paise milte hain?", a: "Withdraw request ke baad, admin verification hoti hai aur phir Razorpay ke through UPI par payment bhej di jaati hai. Aam taur par 2-3 working days lagte hain." },
  { q: "Koi bhi join kar sakta hai?", a: "Haan! India ka koi bhi video creator ya clipper join kar sakta hai. Bas aapke paas ek valid UPI ID hona chahiye payment receive karne ke liye." },
]

const platformIcons: Record<string, string> = {
  YOUTUBE_SHORTS: "▶",
  INSTAGRAM_REELS: "📸",
  TIKTOK: "🎵",
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <span className="text-xl font-bold">ClipKaro</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {s.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
            Start Earning
          </Link>
        </div>

        <button className="p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <div className="space-y-1">
            <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {sections.map((s) => (
              <Link key={s.id} href={`#${s.id}`} className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                {s.label}
              </Link>
            ))}
            <hr />
            <Link href="/login" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>Start Earning</Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

function HeroSection({ stats }: { stats: { totalPaid: number; clippers: number; activeCampaigns: number; minPayout: number } }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Viral Karo.{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Paisa Kamao.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl"
        >
          India ka pehla clipping platform — Indian creators ke clips banao aur views ke hisaab se ₹ kamao.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/signup?role=clipper" className="w-full sm:w-auto rounded-lg bg-emerald-600 px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all">
            Clipper Bano — Free Join Karo
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto rounded-lg border-2 border-emerald-600 px-8 py-3.5 text-lg font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
            Creator Hoon — Campaign Launch Karo
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <p className="text-2xl font-bold text-emerald-600">₹{stats.totalPaid.toLocaleString()}+</p>
            <p className="text-sm text-gray-500">Paid Out</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <p className="text-2xl font-bold text-emerald-600">{stats.clippers}+</p>
            <p className="text-sm text-gray-500">Active Clippers</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <p className="text-2xl font-bold text-emerald-600">{stats.activeCampaigns}+</p>
            <p className="text-sm text-gray-500">Active Campaigns</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <p className="text-2xl font-bold text-emerald-600">₹{stats.minPayout}</p>
            <p className="text-sm text-gray-500">Minimum Payout</p>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100/30 blur-3xl" />
    </section>
  )
}

function HowItWorksSection() {
  const [tab, setTab] = useState<"clipper" | "creator">("clipper")

  const clipperSteps = [
    { step: 1, title: "Campaign Dhundho", desc: "Browse active campaigns, dekho kaun kitna pay kar raha hai.", emoji: "🔍" },
    { step: 2, title: "Clip Banao", desc: "Creator ka long video lo, 30-60 sec ka viral clip banao CapCut se.", emoji: "✂️" },
    { step: 3, title: "Paisa Kamao", desc: "Link submit karo, views aao, ₹ aao — seedha UPI pe.", emoji: "💰" },
  ]

  const creatorSteps = [
    { step: 1, title: "Campaign Banao", desc: "Apna video upload karo, bounty set karo.", emoji: "📢" },
    { step: 2, title: "Clippers Kaam Karein", desc: "Hazaron clippers aapke clips viral karenge.", emoji: "👥" },
    { step: 3, title: "Views Aayein", desc: "Free mein viral ho, sirf views pe pay karo.", emoji: "📈" },
  ]

  const steps = tab === "clipper" ? clipperSteps : creatorSteps

  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Kaise Kaam Karta Hai?</h2>

        <div className="mt-8 inline-flex rounded-lg border p-1">
          <button onClick={() => setTab("clipper")} className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${tab === "clipper" ? "bg-emerald-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
            Clipper Hoon
          </button>
          <button onClick={() => setTab("creator")} className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${tab === "creator" ? "bg-emerald-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
            Creator Hoon
          </button>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="inline-block text-4xl">{s.emoji}</span>
              <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {s.step}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EarningsCalculatorSection() {
  const [clipsPerDay, setClipsPerDay] = useState(5)
  const [avgViews, setAvgViews] = useState(50000)
  const [bountyRate, setBountyRate] = useState(25)

  const viewsPerMonth = clipsPerDay * 30 * avgViews
  const monthlyEarnings = (viewsPerMonth / 100000) * bountyRate

  return (
    <section id="earnings" className="scroll-mt-20 bg-gradient-to-b from-emerald-50 to-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Kitna Kama Sakte Ho?</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium">Kitne clips banate ho per day? ({clipsPerDay})</label>
              <input type="range" min={1} max={20} value={clipsPerDay} onChange={(e) => setClipsPerDay(Number(e.target.value))} className="w-full accent-emerald-600" />
              <div className="mt-1 flex justify-between text-xs text-gray-400"><span>1</span><span>20</span></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Average views per clip? ({(avgViews / 1000).toFixed(0)}K)</label>
              <input type="range" min={1000} max={500000} step={1000} value={avgViews} onChange={(e) => setAvgViews(Number(e.target.value))} className="w-full accent-emerald-600" />
              <div className="mt-1 flex justify-between text-xs text-gray-400"><span>1K</span><span>500K</span></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Kaun sa campaign?</label>
              <select value={bountyRate} onChange={(e) => setBountyRate(Number(e.target.value))} className="w-full rounded-lg border p-2.5 text-sm">
                <option value={10}>₹10/lakh views</option>
                <option value={25}>₹25/lakh views</option>
                <option value={50}>₹50/lakh views</option>
              </select>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-sm text-gray-600">Monthly Earning Estimate</p>
              <p className="text-4xl font-bold text-emerald-600">₹{Math.round(monthlyEarnings).toLocaleString()}/month</p>
              <p className="mt-1 text-xs text-gray-400">Top clippers earn ₹50,000+/month</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: "Rahul, Delhi", clips: 2, earning: 18000 },
              { name: "Priya, Mumbai", clips: 5, earning: 45000 },
              { name: "Amit, Bangalore", clips: 10, earning: 90000 },
            ].map((example) => (
              <div key={example.name} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div>
                  <p className="font-semibold">{example.name}</p>
                  <p className="text-sm text-gray-500">{example.clips} clips/day</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">₹{example.earning.toLocaleString()}/month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ActiveCampaignsSection({ campaigns }: { campaigns: CampaignCard[] }) {
  return (
    <section className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Abhi Available Campaigns</h2>

        {campaigns.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">No active campaigns right now. Be the first to join!</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {(c.creatorName || "C").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.creatorName || "Creator"}</p>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold line-clamp-2">{c.title}</h3>
                <p className="mt-2 text-2xl font-bold text-emerald-600">₹{c.bountyPerLakhViews}/lakh views</p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>Remaining: ₹{c.remainingBounty.toLocaleString()}</span>
                  <div className="flex gap-1">
                    {c.platforms.map((p) => (
                      <span key={p} className="text-xs">{platformIcons[p] || p}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard/clipper" className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
            Sabhi Campaigns Dekho →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ForCreatorsSection() {
  return (
    <section id="for-creators" className="scroll-mt-20 bg-gradient-to-b from-emerald-50 to-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Creator Ho? Free Marketing Milegi</h2>
          <p className="mt-4 text-lg text-gray-600">Hazaron clippers aapka content viral karenge, aur aap sirf results ke liye pay karenge.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { title: "Sirf Results Pe Pay Karo", desc: "Views aayein tabhi paise jaayein.", emoji: "🎯" },
            { title: "Army of Clippers", desc: "Hazaron editors aapka content viral karenge.", emoji: "👥" },
            { title: "Zero Effort", desc: "Aapko kuch nahi karna, bas video do.", emoji: "😌" },
            { title: "Full Analytics", desc: "Dekho kaun sa clip viral hua.", emoji: "📊" },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <span className="text-3xl">{b.emoji}</span>
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup?role=creator" className="inline-block rounded-lg bg-emerald-600 px-8 py-3.5 text-lg font-medium text-white shadow-lg hover:bg-emerald-700 transition-all">
            Campaign Launch Karo
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      city: "Delhi",
      role: "Clipper",
      text: "Maine socha nahi tha ki clipping se itna earn kar paunga. Roz 2-3 clips banata hoon aur ₹15-18k/month kama leta hoon. ClipKaro ne meri zindagi badal di!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      city: "Mumbai",
      role: "Creator",
      text: "Ek campaign launch kiya aur 50+ clippers ne mere content par clips banaye. 2 hafte mein 2 lakh views mile bina koi ads kharch kiye. Bahut powerful hai!",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      city: "Bangalore",
      role: "Clipper",
      text: "ClipKaro use karna bahut easy hai. Bas campaign dhundho, clip banao, submit karo. UI bahut simple hai aur payment bhi time pe aati hai.",
      rating: 5,
    },
  ]

  return (
    <section className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Logon Ne Kya Kaha</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.text}</p>
              <div className="mt-4 border-t pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-gray-400">{t.city} · {t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="scroll-mt-20 bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Sawaal Jawab</h2>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-white">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-medium"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <span className={`text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openIndex === i && (
                <div className="border-t px-4 pb-4 pt-3 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold text-white md:text-5xl">Aaj Hi Shuru Karo</h2>
        <p className="mt-4 text-lg text-emerald-100">Free join karo — koi monthly fee nahi</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/signup?role=clipper" className="w-full sm:w-auto rounded-lg bg-white px-8 py-3.5 text-lg font-medium text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xl">
            Clipper Bano
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto rounded-lg border-2 border-white px-8 py-3.5 text-lg font-medium text-white hover:bg-emerald-600 transition-colors">
            Creator Bano
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✂️</span>
              <span className="text-lg font-bold text-white">ClipKaro</span>
            </div>
            <p className="mt-3 text-sm">India ka pehla clipping platform. Clips banao, views kamao, ₹ kamao.</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="#how-it-works" className="block hover:text-white transition-colors">How it Works</Link>
              <Link href="#for-creators" className="block hover:text-white transition-colors">For Creators</Link>
              <Link href="#earnings" className="block hover:text-white transition-colors">Earnings</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Follow Us</h4>
            <div className="space-y-2 text-sm">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Twitter</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
          <p>Made in India 🇮🇳 — © 2024 ClipKaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [stats, setStats] = useState({ totalPaid: 0, clippers: 0, activeCampaigns: 0, minPayout: 500 })
  const [campaigns, setCampaigns] = useState<CampaignCard[]>([])

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(data.slice(0, 3).map(mapCampaign))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection stats={stats} />
        <HowItWorksSection />
        <EarningsCalculatorSection />
        <ActiveCampaignsSection campaigns={campaigns} />
        <ForCreatorsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}

interface CampaignCard {
  id: string
  title: string
  bountyPerLakhViews: number
  remainingBounty: number
  platforms: string[]
  creatorName: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCampaign(raw: any): CampaignCard {
  return {
    id: raw.id,
    title: raw.title,
    bountyPerLakhViews: raw.bountyPerLakhViews,
    remainingBounty: raw.remainingBounty,
    platforms: raw.allowedPlatforms || [],
    creatorName: raw.creator?.name || raw.creator?.creatorProfile?.channelName || null,
  }
}
