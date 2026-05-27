"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: "CREATOR" | "CLIPPER" | "ADMIN"
  upiId: string | null
  totalEarned: number
  totalWithdrawn: number
  isVerified: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const res = await fetch("/api/user/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      }

      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading }
}
