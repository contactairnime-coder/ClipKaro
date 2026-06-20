"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Scissors, Search, Megaphone, Users, TrendingUp, Target, BarChart3, Star, Camera, Music, Play, ChevronDown, ArrowRight, Wallet, Zap, Globe, Share2, Monitor, Clock, ShieldCheck, Sparkles, Timer, CheckCircle2 } from "lucide-react"

const words = ["Clips banao", "Views lao", "Paisa kamao"]

const sections = [
  { id: "how-it-works", label: "How it Works" },
  { id: "campaigns", label: "Campaigns" },
  { id: "for-creators", label: "For Creators" },
  { id: "earnings", label: "Earnings" },
]

const faqs = [
  { q: "Clipping kya hota hai?", a: "Clipping ka matlab hota hai kisi bade video (long-form) se chhota, engaging clip banana aur social media par share karna. Clipr pe creators apne videos ke liye clippers ko bounty dete hain." },
  { q: "Kya yeh free hai join karna?", a: "Haan, bilkul free! Clipr join karna aur clipper banna completely free hai. Koi monthly fee, koi hidden charges nahi." },
  { q: "Kya mobile se kaam kar sakte hain?", a: "Haan! Aap mobile se bhi pura process kar sakte hain. CapCut mobile app se clip banao, upload karo aur submit karo. Sab mobile-friendly hai." },
  { q: "Payment kaise milega?", a: "Payment seedha aapke UPI ID par aata hai. Jab aapki clips views generate karengi, aapki earnings calculate hoti hai aur aap withdraw kar sakte hain." },
  { q: "Minimum withdrawal kitna hai?", a: "Minimum withdrawal ₹500 hai. Jaise hi aapki earnings ₹500 se zyada hoti hai, aap withdraw request kar sakte hain." },
  { q: "Kitne time mein paise milte hain?", a: "Withdraw request ke baad, admin verification hoti hai aur phir Razorpay ke through UPI par payment bhej di jaati hai. Aam taur par 2-3 working days lagte hain." },
  { q: "Kya CapCut free hai?", a: "Haan, CapCut bilkul free hai. Aap mobile ya PC dono par CapCut use kar sakte hain. Isse clipping karna bahut easy ho jata hai." },
  { q: "Ek din mein kitne clips submit kar sakte hain?", a: "Koi limit nahi hai! Aap jitne chahe utne clips submit kar sakte hain. Har clip ki alag earning hogi views ke hisaab se." },
]

const testimonials = [
  {
    name: "Rahul Sharma", city: "Delhi", role: "Top Clipper",
    text: "Maine socha nahi tha ki clipping se itna earn kar paunga. Roz 2-3 clips banata hoon aur ₹15-18k/month kama leta hoon. Clipr ne meri zindagi badal di!",
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

function useCountUp(end: number, duration = 2, startOnView = true) {
  const [count, setCount] = useState(0)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref || !startOnView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime: number | null = null
          const animate = (time: number) => {
            if (!startTime) startTime = time
            const progress = Math.min((time - startTime) / (duration * 1000), 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, end, duration, startOnView])

  return { count, ref: setRef }
}

function useTypingAnimation(words: string[], typingSpeed = 80, deleteSpeed = 40, pauseDuration = 2000) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deleteSpeed)
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % words.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, words, typingSpeed, deleteSpeed, pauseDuration])

  return displayText
}

function FloatingCard({ children, x, y, delay }: { children: React.ReactNode; x: number; y: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className="absolute"
      style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
    >
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
        className="relative"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#1f1f1f]" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-green-400" />
          <span className="text-xl font-extrabold text-white">Clipr</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
              {s.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full" />
            </Link>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-green-500 transition-all flex items-center gap-2 text-sm">
            Start Earning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button className="p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <div className="space-y-1">
            <span className={`block h-0.5 w-6 bg-gray-400 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-400 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-400 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 top-16 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden flex flex-col"
        >
          <div className="flex flex-col gap-2 p-8">
            {sections.map((s) => (
              <Link key={s.id} href={`#${s.id}`} className="text-xl font-medium text-gray-300 py-4 border-b border-[#1f1f1f]" onClick={() => setMenuOpen(false)}>
                {s.label}
              </Link>
            ))}
            <div className="mt-8 space-y-4">
              <Link href="/login" className="block text-xl font-medium text-gray-300 py-3" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="block w-full bg-green-600 px-6 py-4 text-center text-lg font-bold text-white rounded-xl" onClick={() => setMenuOpen(false)}>Start Earning</Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

function HeroSection() {
  const typedText = useTypingAnimation(words)

  const notificationCards = [
    {
      bg: "bg-green-600/90 border-green-400/20",
      label: "LIVE EARNING",
      labelClass: "text-green-200",
      text: <>Rahul ne <span className="text-green-200">₹2,400</span> kamaye aaj</>,
    },
    {
      bg: "bg-white/10 border-white/10",
      label: "NEW CAMPAIGN",
      labelClass: "text-gray-400",
      text: <>₹<span className="text-green-400">50</span>/lakh views</>,
    },
    {
      bg: "bg-blue-600/50 border-blue-400/20",
      label: "VIEWS SYNCED",
      labelClass: "text-blue-200",
      text: <><span className="text-blue-200">1,204</span> views synced</>,
    },
  ]

  return (
    <section className="relative flex flex-col items-center min-h-screen pt-20 pb-32 px-4 md:px-8 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #052e16 50%, #0a0a0a 100%)" }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-green-500/10 text-green-400 font-semibold text-xs tracking-widest px-4 py-1.5 rounded-full mb-6 border border-green-500/20"
        >
          INDIA&apos;S #1 CLIPPING PLATFORM
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(32px,8vw,72px)] font-extrabold tracking-tight text-white mb-4 leading-tight"
        >
          Viral Karo. <span className="text-green-400">Paisa Kamao.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-12 md:h-14 flex items-center justify-center mb-8"
        >
          <span className="text-xl md:text-2xl text-gray-300 font-medium">
            {typedText}
            <span className="inline-block w-0.5 h-6 md:h-7 bg-green-400 ml-1 animate-pulse" />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Indian creators ke clips banao aur views ke hisaab se ₹ kamao. Turn trending long-form content into viral reels and get paid.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/signup?role=clipper" className="w-full sm:w-auto bg-green-600 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 min-h-[44px] rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-500/30 hover:bg-green-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            Join as Clipper — Free
            <Sparkles className="w-5 h-5" />
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto bg-white/5 text-white border border-[#1f1f1f] font-bold text-base sm:text-lg px-8 sm:px-10 py-4 min-h-[44px] rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
            Launch Campaign
          </Link>
        </motion.div>

        <div className="flex flex-col gap-3 w-full mt-6 md:hidden">
          {notificationCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`w-full flex items-center gap-3 rounded-xl p-3 text-sm backdrop-blur-sm ${card.bg}`}
            >
              <div>
                <p className={`text-[10px] ${card.labelClass}`}>{card.label}</p>
                <p className="text-white font-bold text-sm">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
        {notificationCards.map((card, i) => {
          const positions = [
            { x: -35, y: -15, delay: 0.5 },
            { x: 35, y: -10, delay: 1 },
            { x: 0, y: 20, delay: 1.5 },
          ]
          const pos = positions[i]
          return (
            <FloatingCard key={card.label} x={pos.x} y={pos.y} delay={pos.delay}>
              <div className={`backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-xl border w-52 ${card.bg}`}>
                <p className={`text-xs ${card.labelClass}`}>{card.label}</p>
                <p className="text-lg font-bold">{card.text}</p>
              </div>
            </FloatingCard>
          )
        })}
      </div>
    </section>
  )
}

function StatsBar() {
  const { count: paidOut, ref: paidRef } = useCountUp(240000)
  const { count: clippers, ref: clipperRef } = useCountUp(240)
  const { count: campaigns, ref: campaignRef } = useCountUp(12)
  const { count: minPayout, ref: payoutRef } = useCountUp(500)

  const formatCr = (val: number) => (val / 100000).toFixed(1)

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-20 mb-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1f1f1f] rounded-2xl overflow-hidden border border-[#1f1f1f]">
        {[
          { ref: paidRef, value: `₹${formatCr(paidOut)}L+`, label: "Paid Out" },
          { ref: clipperRef, value: `${clippers}+`, label: "Active Clippers" },
          { ref: campaignRef, value: `${campaigns}`, label: "Live Campaigns" },
          { ref: payoutRef, value: `₹${minPayout}`, label: "Min Payout" },
        ].map((item) => (
          <div key={item.label} ref={item.ref} className="bg-[#111111] p-6 md:p-8 text-center">
            <div className="text-green-400 font-bold text-2xl md:text-3xl mb-1">{item.value}</div>
            <div className="text-gray-500 text-xs md:text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TrustBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Secured by</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-gray-300 font-semibold text-sm">Razorpay</span>
            </div>
            <div className="w-px h-6 bg-[#1f1f1f]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-gray-300 font-semibold text-sm">Supabase</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> 256-bit encrypted payments</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Instant UPI payouts</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const [tab, setTab] = useState<"clipper" | "creator">("clipper")

  const clipperSteps = [
    { step: 1, title: "Campaign Dhundho", time: "2 min", desc: "Browse active campaigns, dekho kaun kitna pay kar raha hai.", icon: <Search className="w-6 h-6" /> },
    { step: 2, title: "Clip Banao", time: "15 min", desc: "CapCut se viral clip banao aur upload karo.", icon: <Scissors className="w-6 h-6" /> },
    { step: 3, title: "Paisa Kamao", time: "Auto", desc: "Views aate hi paisa automatically aapke UPI pe aata hai.", icon: <Wallet className="w-6 h-6" /> },
  ]

  const creatorSteps = [
    { step: 1, title: "Campaign Banao", time: "5 min", desc: "Apna video upload karo, bounty set karo.", icon: <Megaphone className="w-6 h-6" /> },
    { step: 2, title: "Clippers Kaam Karein", time: "Auto", desc: "Hazaron clippers aapke content viral karenge.", icon: <Users className="w-6 h-6" /> },
    { step: 3, title: "Views Aayein", time: "Results", desc: "Free mein viral ho, sirf views pe pay karo.", icon: <TrendingUp className="w-6 h-6" /> },
  ]

  const steps = tab === "clipper" ? clipperSteps : creatorSteps

  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(24px,6vw,48px)] font-bold text-white mb-4"
        >
          Kaise Kaam Karta Hai?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 p-1 bg-[#111111] max-w-xs mx-auto rounded-full border border-[#1f1f1f] mt-8 mb-16"
        >
          <button onClick={() => setTab("clipper")} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${tab === "clipper" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
            Clipper Hoon
          </button>
          <button onClick={() => setTab("creator")} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${tab === "creator" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
            Creator Hoon
          </button>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-[#1f1f1f]">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 relative z-10">
                  <div className="text-green-400">{s.icon}</div>
                </div>
                {i < steps.length - 1 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.3 }}
                      className="hidden md:block absolute top-8 -right-6 z-20"
                    >
                      <ArrowRight className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.3 }}
                      className="md:hidden my-4"
                    >
                      <ChevronDown className="w-6 h-6 text-green-500 mx-auto" />
                    </motion.div>
                  </>
                )}
                <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center mb-3 text-sm">
                  {s.step}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full mb-3">
                  <Clock className="w-3 h-3" />
                  {s.time}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EarningsCalculatorSection() {
  const [clipsPerDay, setClipsPerDay] = useState(5)
  const [avgViews, setAvgViews] = useState(10)

  const dailyEarning = clipsPerDay * (avgViews * 100)
  const weeklyEarning = dailyEarning * 7
  const monthlyEarning = dailyEarning * 30

  return (
    <section id="earnings" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-[clamp(24px,6vw,48px)] font-bold text-white">Kitna Kama Sakte Ho?</h2>
          <p className="text-gray-400 text-lg mt-2">Estimate your potential earnings based on your reach.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#111111] p-8 md:p-10 rounded-[2rem] border border-[#1f1f1f]"
          >
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-bold text-gray-200">Daily clips banate ho?</label>
                  <span className="text-green-400 font-bold">{clipsPerDay} Clips</span>
                </div>
                <input type="range" min={1} max={20} value={clipsPerDay} onChange={(e) => setClipsPerDay(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-gray-600 text-xs mt-2">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-bold text-gray-200">Avg views per clip?</label>
                  <span className="text-green-400 font-bold">{avgViews}K Views</span>
                </div>
                <input type="range" min={1} max={100} value={avgViews} onChange={(e) => setAvgViews(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-gray-600 text-xs mt-2">
                  <span>1K</span>
                  <span>100K</span>
                </div>
              </div>

              <div className="bg-green-500/5 p-6 md:p-8 rounded-2xl border border-green-500/10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Per Day</p>
                    <p className="text-green-400 font-bold text-lg">₹{dailyEarning.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-center border-x border-green-500/10">
                    <p className="text-gray-400 text-xs mb-1">Per Week</p>
                    <p className="text-green-400 font-bold text-lg">₹{weeklyEarning.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Per Month</p>
                    <p className="text-green-400 font-bold text-lg">₹{monthlyEarning.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="text-center border-t border-green-500/10 pt-4">
                  <p className="text-green-400 font-extrabold text-5xl md:text-6xl leading-none mb-2">
                    ₹{monthlyEarning.toLocaleString("en-IN")}/mo
                  </p>
                  <p className="text-xs text-gray-500">Yeh ek part-time job se zyada hai 🚀</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="bg-[#111111] p-8 rounded-[2rem] border border-[#1f1f1f] flex-1">
              <h4 className="text-xl font-bold text-white mb-6">Top Clippers This Month</h4>
              <div className="space-y-5">
                {[
                  { name: "Rahul, Delhi", initials: "RA", clips: "2 clips/day", amount: "₹18,000", bg: "bg-green-700" },
                  { name: "Priya, Mumbai", initials: "PR", clips: "5 clips/day", amount: "₹45,000", bg: "bg-blue-700" },
                  { name: "Amit, Bangalore", initials: "AK", clips: "10 clips/day", amount: "₹92,000", bg: "bg-gray-700" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center font-bold text-sm text-white`}>
                        {item.initials}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.clips}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<CampaignCard[]>([])

  const fallbackCampaigns: CampaignCard[] = [
    {
      id: "1",
      title: "Tech Tips Clips",
      bountyPerLakhViews: 25,
      remainingBounty: 15000,
      platforms: ["YOUTUBE_SHORTS", "INSTAGRAM_REELS"],
      creatorName: "TechWithRahul",
    },
    {
      id: "2",
      title: "Money Tips Clips",
      bountyPerLakhViews: 50,
      remainingBounty: 25000,
      platforms: ["YOUTUBE_SHORTS"],
      creatorName: "FinanceWithPriya",
    },
    {
      id: "3",
      title: "Motivation Clips",
      bountyPerLakhViews: 30,
      remainingBounty: 10000,
      platforms: ["YOUTUBE_SHORTS", "INSTAGRAM_REELS", "TIKTOK"],
      creatorName: "MotivationDaily",
    },
  ]

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setCampaigns(data.slice(0, 3).map(mapCampaign))
        } else {
          setCampaigns(fallbackCampaigns)
        }
      })
      .catch(() => {
        setCampaigns(fallbackCampaigns)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const displayCampaigns = campaigns.length > 0 ? campaigns : fallbackCampaigns

  return (
    <section id="campaigns" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[clamp(24px,6vw,48px)] font-bold text-white mb-4">Abhi Available Campaigns</h2>
          <p className="text-gray-400">In campaigns ke clips banao aur views ke hisaab se paisa kamao.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayCampaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className={`bg-[#111111] rounded-2xl border border-[#1f1f1f] p-6 relative ${i >= 1 ? "blur-sm pointer-events-none select-none" : "hover:border-green-500/30 hover:-translate-y-1"}`}>
                {i === 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-400 border border-green-500/20">
                    {(c.creatorName || "C").charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-gray-300">{c.creatorName || "Creator"}</p>
                </div>
                <h3 className="font-bold text-white line-clamp-2 mb-3">{c.title}</h3>
                <p className="text-2xl font-bold text-green-400 mb-3">₹{c.bountyPerLakhViews}/lakh views</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Remaining: ₹{c.remainingBounty.toLocaleString()}</span>
                  <div className="flex gap-1">
                    {c.platforms.map((p) => (
                      <span key={p} className="text-gray-500">{platformIcons[p] || p}</span>
                    ))}
                  </div>
                </div>
                <Link href={i === 0 ? "/signup?role=clipper" : "#"} className={`block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-colors ${i === 0 ? "bg-green-600 text-white hover:bg-green-500" : "bg-[#1f1f1f] text-gray-500"}`}>
                  {i === 0 ? "Join Campaign" : "Unlock Campaign"}
                </Link>
              </div>
              {i >= 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Link
                    href="/login"
                    className="bg-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-green-500 transition-all text-base"
                  >
                    Login to get started
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link href="/dashboard/clipper" className="inline-block bg-white/5 text-white border border-[#1f1f1f] px-8 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
            Sabhi Campaigns Dekho <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function UrgencySection() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <section className="px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-amber-600/20 border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-bold text-amber-400 mb-4">
              🔥 Launch Offer: Pehle 100 Clippers ko ₹100 Signup Bonus
            </p>
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between text-sm text-amber-300 mb-2">
                <span>67/100 spots filled</span>
                <span>{Math.round((67 / 100) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-900/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "67%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-amber-300">
                <Timer className="w-5 h-5" />
                <span className="text-2xl font-mono font-bold">
                  {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            <Link href="/signup?role=clipper" className="inline-block bg-amber-500 text-black font-bold px-10 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-xl text-lg">
              Join Karo Abhi 🚀
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const topEarners = [
    { name: "Amit, Delhi", amount: "₹18,420", initials: "AM" },
    { name: "Sneha, Pune", amount: "₹9,800", initials: "SN" },
    { name: "Rohan, Hyderabad", amount: "₹31,200", initials: "RH" },
  ]

  return (
    <section className="py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(24px,6vw,48px)] font-bold text-white text-center mb-16"
        >
          Clippers Ki Real Earnings
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topEarners.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-lg border border-green-500/20">
                    {e.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{e.name}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Earnings
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400">{e.amount}</p>
              <p className="text-xs text-gray-500 mt-1">this month</p>
            </motion.div>
          ))}
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
    <section id="for-creators" className="scroll-mt-20 py-24 md:py-32 px-4 md:px-8 overflow-hidden relative" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #052e16 50%, #0a0a0a 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-[clamp(24px,6vw,48px)] font-bold text-white mb-4">Creator Ho? Free Marketing Milegi</h2>
          <p className="text-lg text-gray-400">Hazaron clippers aapka content viral karenge, aur aap sirf results ke liye pay karenge.</p>
        </motion.div>
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
              <div className="text-green-400 mb-6">{f.icon}</div>
              <h4 className="text-white font-bold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/signup?role=creator" className="inline-block bg-green-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-green-500 transition-all shadow-xl">
            Launch Your Campaign Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(24px,6vw,48px)] font-bold text-white text-center mb-16"
        >
          Logon Ne Kya Kaha
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-[1.5rem] flex flex-col justify-between hover:border-green-500/20 transition-all"
            >
              <div>
                <div className="flex text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-400 italic mb-8">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                  <Image className="w-full h-full object-cover" src={t.img} alt={t.name} width={48} height={48} />
                </div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
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
    <section className="py-24 md:py-32 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(24px,6vw,48px)] font-bold text-white text-center mb-16"
        >
          Sawaal Jawab
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden"
            >
              <button
                className="w-full p-6 min-h-[48px] font-bold text-left text-gray-200 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden" style={{ background: "linear-gradient(135deg, #052e16 0%, #0a0a0a 50%, #052e16 100%)" }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(32px,8vw,64px)] font-extrabold text-white mb-6"
        >
          Aaj Hi Shuru Karo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-green-200 text-lg md:text-xl mb-8 max-w-xl mx-auto"
        >
          Aaj join karo — kal se campaigns bhar sakti hain
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-gray-500 text-sm mb-12"
        >
          No credit card required &bull; Free forever for clippers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup?role=clipper" className="w-full sm:w-auto bg-green-600 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl shadow-green-600/20 hover:bg-green-500 hover:scale-[1.05] transition-all">
            Join Free Now
          </Link>
          <Link href="/contact" className="w-full sm:w-auto bg-white/5 text-white border border-[#1f1f1f] font-bold text-lg px-12 py-5 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
            Contact Support
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-16 md:py-24 px-4 md:px-8 border-t border-[#1f1f1f]" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-16 gap-12">
          <div className="max-w-sm text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <Scissors className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">Clipr</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">India ka pehla clipping platform. Indian creators ke clips banao, views kamao, ₹ kamao.</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center hover:bg-green-600 transition-colors border border-[#1f1f1f]">
                <Globe className="w-5 h-5 text-gray-400" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center hover:bg-green-600 transition-colors border border-[#1f1f1f]">
                <Share2 className="w-5 h-5 text-gray-400" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center hover:bg-green-600 transition-colors border border-[#1f1f1f]">
                <Monitor className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h5 className="text-white font-bold mb-6">Platform</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#how-it-works" className="text-gray-500 hover:text-green-400 transition-colors">How it Works</a></li>
                <li><a href="#for-creators" className="text-gray-500 hover:text-green-400 transition-colors">For Creators</a></li>
                <li><a href="#campaigns" className="text-gray-500 hover:text-green-400 transition-colors">Campaigns</a></li>
                <li><a href="#earnings" className="text-gray-500 hover:text-green-400 transition-colors">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Support</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="/contact" className="text-gray-500 hover:text-green-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-500 hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-500 hover:text-green-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Legal</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="/terms" className="text-gray-500 hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-500 hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1f1f1f] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div>&copy; 2026 Clipr. All rights reserved.</div>
          <div>Made in India with ❤️ for the Creator Economy</div>
        </div>
      </div>
    </footer>
  )
}

function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1f1f1f] p-3">
      <Link href="/signup?role=clipper" className="block w-full bg-green-600 text-white text-center font-bold py-3 rounded-xl hover:bg-green-500 transition-colors">
        Join Free <ArrowRight className="w-4 h-4 inline" />
      </Link>
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans pb-16 md:pb-0">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <TrustBar />
        <HowItWorksSection />
        <EarningsCalculatorSection />
        <CampaignsSection />
        <UrgencySection />
        <SocialProofSection />
        <ForCreatorsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  )
}
