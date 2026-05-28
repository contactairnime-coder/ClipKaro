"use client"

import type { ReactNode } from "react"
import { Scissors, Star } from "lucide-react"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: ReactNode
  variant: "login" | "signup"
}

const stats = [
  { value: "₹2.4L+", label: "Paid Out" },
  { value: "240+", label: "Active Clippers" },
  { value: "12", label: "Live Campaigns" },
]

const signupSteps = [
  { num: 1, text: "Free join karo" },
  { num: 2, text: "Campaigns browse karo" },
  { num: 3, text: "Clips banao" },
  { num: 4, text: "₹ kamao" },
]

export default function AuthLayout({ children, variant }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1f0a 0%, #16a34a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="flex flex-col justify-between p-16 w-full relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ClipKaro</span>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Viral Karo. Paisa Kamao.</h2>
              <p className="text-green-200 mt-2">
                {variant === "login" ? "Apne account mein wapas aao" : "Join 240+ Clippers aur shuru karo"}
              </p>
            </div>

            {variant === "signup" ? (
              <div className="space-y-5">
                {signupSteps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                      {step.num}
                    </div>
                    <span className="text-white text-sm">{step.text}</span>
                  </motion.div>
                ))}
                <p className="text-xs text-green-300 mt-6">No monthly fee &bull; No credit card</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                  >
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-green-200 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {variant === "login" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-400/30 flex items-center justify-center text-white font-bold text-sm">
                  RS
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Rahul, Delhi</p>
                  <p className="text-green-200 text-xs">Pehle mahine mein ₹18,000 kamaye</p>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ClipKaro</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
