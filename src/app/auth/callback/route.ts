import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_session`)
  }

  const existing = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!existing) {
    const meta = user.user_metadata || {}
    const role = meta.role as string | undefined
    // Google OAuth se aaya hai (no role in metadata) → role selection page bhejo
    if (!role || !["CREATOR", "CLIPPER"].includes(role)) {
      return NextResponse.redirect(`${origin}/auth/complete-profile`)
    }
    // Email signup se aaya hai → role metadata me hai, auto-create
    const email = user.email || ""
    await prisma.profile.create({
      data: {
        id: user.id,
        email,
        name: (meta.name as string) || (meta.full_name as string) || email.split("@")[0] || null,
        avatar: (meta.avatar_url as string) || null,
        role,
      },
    })
    if (role === "CREATOR") {
      await prisma.creatorProfile.create({ data: { userId: user.id } }).catch(() => {})
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
