import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  })

  if (!profile) {
    redirect("/auth/complete-profile")
  }

  if (profile.role === "CREATOR") {
    redirect("/dashboard/creator")
  } else if (profile.role === "ADMIN") {
    redirect("/dashboard/admin")
  } else {
    redirect("/dashboard/clipper")
  }
}
