import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || ""

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const baseUrl = PUBLIC_APP_URL || new URL(request.url).origin

  const safeNext = next.startsWith("/") ? next : "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_error`)
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_session`)
  }

  const existing = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!existing) {
    const meta = user.user_metadata || {}
    const role = meta.role as string | undefined
    if (!role || !["CREATOR", "CLIPPER"].includes(role)) {
      return NextResponse.redirect(`${baseUrl}/auth/complete-profile`)
    }
    const email = user.email || ""
    await prisma.profile.create({
      data: {
        id: user.id,
        email,
        name: (meta.name as string) || (meta.full_name as string) || email.split("@")[0] || null,
        avatar: (meta.avatar_url as string) || null,
        role: role as "CREATOR" | "CLIPPER",
      },
    })
    if (role === "CREATOR") {
      await prisma.creatorProfile.create({ data: { userId: user.id } }).catch(() => {})
    }
  }

  return NextResponse.redirect(`${baseUrl}${safeNext}`)
}
