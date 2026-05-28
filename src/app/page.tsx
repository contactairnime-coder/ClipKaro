"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Scissors, Search, Megaphone, Users, TrendingUp, Target, BarChart3, Star, Camera, Music, Play, ChevronDown, ArrowRight, Wallet, Zap, Globe, Share2, Monitor } from "lucide-react"

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

const testimonials = [
  {
    name: "Rahul Sharma", city: "Delhi", role: "Top Clipper",
    text: "Maine socha nahi tha ki clipping se itna earn kar paunga. Roz 2-3 clips banata hoon aur ₹15-18k/month kama leta hoon. ClipKaro ne meri zindagi badal di!",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD99Kar7S6HeeYKN4JXV7rnUFPddt0pQcB53Kshk0kQ4OwVegqv8WMH0acdGv3NexpglOiOjTpKXn5C8syoWCRyYFTrgbKr7GmZtZM4D6HG3xo8YTGc5IgkZe-ENmwpAwj2_GaR21vX_vbnEiZWsWhN14Skab3LKqAuZc0GLdtFI_K8ZLWDoocrJnRwd6U3PHX4cwOa6m30iYSdb7IHtoHI8xjjU7dL2zimYyjayxEXuFye4X9zndvYX1lCFjLeulVNcxqJMAF7SzI",
    initial: "RS",
  },
  {
    name: "Priya Patel", city: "Mumbai", role: "Video Creator",
    text: "As a creator, managing distribution was a headache. Ab mere videos 100+ accounts pe viral ho rahe hain automatically. My reach has exploded by 10x!",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4mA4agNf6GprRS3ImeRvxv11_iIYsx7LT9uwu7qNZx-79LCxPY10AwL7imOIVWPIQDXWfS9BCBU9lBSS-PEyFqivmAVtR_azgknG7D0seozFdrWdg4wgdydzus3lCENKoI0gLKADph2x3EBns5mT3w5FzDJu4ezvItH8JHHtYezKZpMxnV6qj8F6nfxiK_5K14lijlOh-D0vtlRmCTaPcPKI4V4qoVUYohLegoUO62j3eAYwlkjXWv1gKmo7dscKttktKeqHDR0k",
    initial: "PP",
  },
  {
    name: "Amit Kumar", city: "Bangalore", role: "Editor",
    text: "The payments are super fast and transparent. I started as a part-time clipper and now I am doing it full time because the potential is massive.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAusKIIPmQvk7p_qPL_EtK1Rw46B6qVq_m2qf6D4-3-_-nDfGE6ZVfc_kdL6OS1ieVex740gRLfm8tXUQaRNGfh-4W3O2xtIUZZbSuXcWxQWdEkkIM9MgioLGbfyxs1_oVFWGSqXRLv9Xz_Yk8O2I4-LqszUIkFxbaUkrAyecb-AV5H7uvxvxbCe5c0axd9EM94RhRqrSN0n2uzgbl5N_t-l2hZLkJqronDCteTBWTNT-W709DMaQkQu997dOxs84g_PBbwNxu3Vos",
    initial: "AK",
  },
]

const platformIcons: Record<string, React.ReactNode> = {
  YOUTUBE_SHORTS: <Play className="w-5 h-5" />,
  INSTAGRAM_REELS: <Camera className="w-5 h-5" />,
  TIKTOK: <Music className="w-5 h-5" />,
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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-emerald-600" />
          <span className="text-xl font-extrabold text-emerald-700">ClipKaro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
              {s.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all">
            Login
          </Link>
          <Link href="/signup" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm">
            Start Earning
            <ArrowRight className="w-4 h-4" />
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
              <Link key={s.id} href={`#${s.id}`} className="text-sm font-medium text-gray-500" onClick={() => setMenuOpen(false)}>
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

function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-4 md:px-8 text-center overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-100/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-emerald-100 text-emerald-800 font-semibold text-xs tracking-widest px-4 py-1.5 rounded-full mb-6"
        >
          INDIA&apos;S #1 CLIPPING PLATFORM
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
        >
          Viral Karo. <span className="text-emerald-600">Paisa Kamao.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto"
        >
          Indian creators ke clips banao aur views ke hisaab se ₹ kamao. Turn trending long-form content into viral reels and get paid for every milestone.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup?role=clipper" className="w-full sm:w-auto bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            Join as Clipper — Free
            <TrendingUp className="w-5 h-5" />
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto bg-white text-emerald-700 border-2 border-emerald-200 font-bold text-lg px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all">
            Launch Campaign
          </Link>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200/30"
      >
        <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
          <div className="text-center p-8">
            <BarChart3 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-emerald-800 font-semibold text-lg">Real-time Earnings Dashboard</p>
            <p className="text-emerald-600 text-sm">Track your clips, views & earnings in one place</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function StatsBar({ stats }: { stats: { totalPaid: number; clippers: number; activeCampaigns: number; minPayout: number } }) {
  const items = [
    { value: `₹${(stats.totalPaid / 10000000).toFixed(1)}Cr+`, label: "Total Paid Out" },
    { value: `${(stats.clippers / 1000).toFixed(0)}K+`, label: "Active Clippers" },
    { value: `${stats.activeCampaigns}+`, label: "Viral Campaigns" },
    { value: `₹${stats.minPayout}`, label: "Min. Payout" },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-10 mb-32">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 md:p-10 rounded-3xl border border-gray-200/50 shadow-sm">
        {items.map((item, i) => (
          <div key={item.label} className={`text-center ${i < items.length - 1 ? "md:border-r border-gray-200" : ""}`}>
            <div className="text-emerald-600 font-bold text-2xl md:text-3xl mb-1">{item.value}</div>
            <div className="text-gray-500 text-xs md:text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const [tab, setTab] = useState<"clipper" | "creator">("clipper")

  const clipperSteps = [
    { step: 1, title: "Campaign Dhundho", desc: "Browse active campaigns, dekho kaun kitna pay kar raha hai and choose your niche.", icon: <Search className="w-8 h-8 text-emerald-600" /> },
    { step: 2, title: "Clip Banao", desc: "Creator ka long video lo, 30-60 sec ka viral clip banao CapCut se or any tool you love.", icon: <Scissors className="w-8 h-8 text-emerald-600" /> },
    { step: 3, title: "Paisa Kamao", desc: "Reels/Shorts pe upload karo. Views badhenge toh bank account mein paisa ayega.", icon: <Wallet className="w-8 h-8 text-emerald-600" /> },
  ]

  const creatorSteps = [
    { step: 1, title: "Campaign Banao", desc: "Apna video upload karo, bounty set karo aur clippers ko invite karo.", icon: <Megaphone className="w-8 h-8 text-emerald-600" /> },
    { step: 2, title: "Clippers Kaam Karein", desc: "Hazaron clippers aapke content se viral clips banayenge.", icon: <Users className="w-8 h-8 text-emerald-600" /> },
    { step: 3, title: "Views Aayein", desc: "Free mein viral ho, sirf views pe pay karo. Zero risk, high ROI.", icon: <TrendingUp className="w-8 h-8 text-emerald-600" /> },
  ]

  const steps = tab === "clipper" ? clipperSteps : creatorSteps

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gray-50 py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Kaise Kaam Karta Hai?</h2>
        <div className="flex items-center justify-center gap-2 p-1 bg-white max-w-xs mx-auto rounded-full border border-gray-200 mt-8 mb-16">
          <button onClick={() => setTab("clipper")} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${tab === "clipper" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Clipper Hoon
          </button>
          <button onClick={() => setTab("creator")} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${tab === "creator" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Creator Hoon
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-emerald-200 group-hover:scale-110 transition-all border border-gray-200">
                {s.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 max-w-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EarningsCalculatorSection() {
  const [clipsPerDay, setClipsPerDay] = useState(5)
  const [avgViews, setAvgViews] = useState(10)

  const monthlyEstimate = clipsPerDay * (avgViews * 100) * 30

  return (
    <section id="earnings" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Kitna Kama Sakte Ho?</h2>
          <p className="text-gray-500 text-lg mt-2">Estimate your potential earnings based on your reach.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm">
            <div className="space-y-10">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-bold text-gray-900">Daily clips banate ho?</label>
                  <span className="text-emerald-600 font-bold">{clipsPerDay} Clips</span>
                </div>
                <input type="range" min={1} max={20} value={clipsPerDay} onChange={(e) => setClipsPerDay(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-gray-400 text-xs mt-2">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-bold text-gray-900">Avg views per clip?</label>
                  <span className="text-emerald-600 font-bold">{avgViews}K Views</span>
                </div>
                <input type="range" min={1} max={100} value={avgViews} onChange={(e) => setAvgViews(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-gray-400 text-xs mt-2">
                  <span>1K</span>
                  <span>100K</span>
                </div>
              </div>
              <div className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-100">
                <p className="text-gray-500 mb-2">Monthly Earning Estimate</p>
                <div className="text-emerald-600 font-extrabold text-5xl md:text-6xl leading-none mb-2">
                  ₹{monthlyEstimate.toLocaleString("en-IN")}/mo
                </div>
                <p className="text-xs text-gray-400 font-medium">Top clippers earn ₹50,000+/month</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] flex-1">
              <h4 className="text-xl font-bold mb-6">Top Clippers This Month</h4>
              <div className="space-y-5">
                {[
                  { name: "Rahul, Delhi", initials: "RA", clips: "2 clips/day", amount: "₹18,000", bg: "bg-emerald-700" },
                  { name: "Priya, Mumbai", initials: "PR", clips: "5 clips/day", amount: "₹45,000", bg: "bg-blue-700" },
                  { name: "Amit, Bangalore", initials: "AK", clips: "10 clips/day", amount: "₹92,000", bg: "bg-gray-700" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center font-bold text-sm`}>
                        {item.initials}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{item.name}</div>
                        <div className="text-xs opacity-70">{item.clips}</div>
                      </div>
                    </div>
                    <div className="text-emerald-300 font-bold">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ActiveCampaignsSection({ campaigns }: { campaigns: CampaignCard[] }) {
  return (
    <section id="for-clippers" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">Abhi Available Campaigns</h2>
        <p className="text-center text-gray-500 mb-12">Active campaigns se clip banao aur views ke hisaab se paisa kamao.</p>

        {campaigns.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No active campaigns right now. Be the first to join!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {(c.creatorName || "C").charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{c.creatorName || "Creator"}</p>
                </div>
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-3">{c.title}</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-3">₹{c.bountyPerLakhViews}/lakh views</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Remaining: ₹{c.remainingBounty.toLocaleString()}</span>
                  <div className="flex gap-1">
                    {c.platforms.map((p) => (
                      <span key={p} className="text-gray-400">{platformIcons[p] || p}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard/clipper" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg">
            Sabhi Campaigns Dekho <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ForCreatorsSection() {
  const features = [
    { icon: <Target className="w-8 h-8" />, title: "Sirf Results Pe Pay Karo", desc: "Views aayein tabhi paise jaayein. Zero risk, high ROI." },
    { icon: <Users className="w-8 h-8" />, title: "Army of Clippers", desc: "Hazaron editors aapka content viral karenge simultaneously." },
    { icon: <Zap className="w-8 h-8" />, title: "Zero Effort", desc: "Aapko kuch nahi karna, bas video drop karo aur wait." },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Full Analytics", desc: "Dekho kaun sa clip viral hua aur kisne viral kiya live." },
  ]

  return (
    <section id="for-creators" className="scroll-mt-20 bg-gray-900 py-24 md:py-32 px-4 md:px-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(5,150,105,0.15),transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Creator Ho? Free Marketing Milegi</h2>
          <p className="text-lg text-gray-400">Hazaron clippers aapka content viral karenge, aur aap sirf results ke liye pay karenge.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all"
            >
              <div className="text-emerald-300 mb-6">{f.icon}</div>
              <h4 className="text-white font-bold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/signup?role=creator" className="inline-block bg-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-emerald-500 transition-all shadow-xl">
            Launch Your Campaign Now
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-16">Logon Ne Kya Kaha</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gray-50 p-8 rounded-[1.5rem] border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-8">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                  <Image className="w-full h-full object-cover" src={t.img} alt={t.name} width={48} height={48} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.city} &bull; {t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-16">Sawaal Jawab</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button
                className="list-none w-full p-6 font-bold text-left text-gray-900 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 pt-2 text-gray-500 leading-relaxed">
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
    <section className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-emerald-700 z-0" />
      <div className="absolute inset-0 opacity-10 pointer-events-none z-1">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-emerald-50 mb-6">Aaj Hi Shuru Karo</h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-12 opacity-90 max-w-xl mx-auto">Free join karo — koi monthly fee nahi. Join thousands of clippers winning with ClipKaro.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup?role=clipper" className="w-full sm:w-auto bg-white text-emerald-700 font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:scale-[1.05] transition-all">
            Join Free Now
          </Link>
          <Link href="/contact" className="w-full sm:w-auto bg-emerald-800/20 text-white border-2 border-white/20 font-bold text-lg px-12 py-5 rounded-2xl hover:bg-white/10 transition-all">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-20 gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <Scissors className="w-6 h-6 text-emerald-400" />
              <span className="text-2xl font-bold text-white">ClipKaro</span>
            </div>
            <p className="opacity-70 mb-8 text-sm">India ka pehla clipping platform. Indian creators ke clips banao, views kamao, ₹ kamao.</p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Monitor className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h5 className="text-white font-bold mb-6">Platform</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
                <li><a href="#for-creators" className="hover:text-emerald-400 transition-colors">For Creators</a></li>
                <li><a href="#for-clippers" className="hover:text-emerald-400 transition-colors">For Clippers</a></li>
                <li><a href="#earnings" className="hover:text-emerald-400 transition-colors">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Support</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Legal</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 text-sm">
          <div>&copy; 2026 ClipKaro. All rights reserved.</div>
          <div>Made in India with ❤️ for the Creator Economy</div>
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
        <HeroSection />
        <StatsBar stats={stats} />
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
