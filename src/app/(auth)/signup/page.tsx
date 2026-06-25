"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Lock, Eye, EyeOff, Scissors, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import AuthLayout from "@/components/auth/AuthLayout"

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") === "creator" ? "CREATOR" : "CLIPPER"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"CREATOR" | "CLIPPER">(defaultRole)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setLoading(false)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return { label: "", width: "0%", color: "" }
    if (pw.length < 4) return { label: "Weak", width: "25%", color: "bg-red-500" }
    if (pw.length < 6) return { label: "Medium", width: "50%", color: "bg-yellow-500" }
    if (pw.length < 8) return { label: "Strong", width: "75%", color: "bg-yellow-500" }
    return { label: "Very Strong", width: "100%", color: "bg-green-500" }
  }

  const strength = getPasswordStrength(password)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setSubmitting(false)
      return
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      setSubmitting(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback?next=/auth/complete-profile` },
    })
    if (error) setError(error.message)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <AuthLayout variant="signup">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 mb-8">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-500 transition-all text-center text-sm"
          >
            Go to login
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout variant="signup">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shuru Karo Aaj 🚀</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Free account banao — 2 minute ka kaam</p>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Main hoon ek...</p>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => setRole("CLIPPER")}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === "CLIPPER"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                role === "CLIPPER" ? "bg-green-600" : "bg-gray-100 dark:bg-[#1a1a1a]"
              }`}>
                <Scissors className={`w-5 h-5 ${role === "CLIPPER" ? "text-white" : "text-gray-400"}`} />
              </div>
              <p className={`font-semibold text-sm ${role === "CLIPPER" ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                Main Clips Banaunga
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Campaigns join karo, ₹ kamao</p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setRole("CREATOR")}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === "CREATOR"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                role === "CREATOR" ? "bg-green-600" : "bg-gray-100 dark:bg-[#1a1a1a]"
              }`}>
                <Camera className={`w-5 h-5 ${role === "CREATOR" ? "text-white" : "text-gray-400"}`} />
              </div>
              <p className={`font-semibold text-sm ${role === "CREATOR" ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                Main Creator Hoon
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Apna content viral karo</p>
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Your name"
                required
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="name@example.com"
                required
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {["Weak", "Medium", "Strong", "Very Strong"].map((level, i) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${role === "CLIPPER" ? "" : ""}`}
                      style={{
                        background:
                          strength.label === level
                            ? strength.color.replace("bg-", "")
                            : i < ["", "Weak", "Medium", "Strong"].indexOf(strength.label)
                            ? strength.color.replace("bg-", "")
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1`} style={{ color: strength.color.replace("bg-", "") || "#9ca3af" }}>
                  {strength.label}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Repeat password"
                minLength={6}
                required
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Main{" "}
                <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
                {" "}aur{" "}
                <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                {" "}se agree karta hoon
              </span>
            </label>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Account Banao — Free"
            )}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#0a0a0a] px-3 text-gray-400">OR</span>
          </div>
        </div>

        <motion.button
          onClick={handleGoogleSignup}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-[#2a2a2a] py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </motion.button>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already account hai?{" "}
          <Link href="/login" className="font-semibold text-green-600 hover:text-green-500">
            Login karo
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
