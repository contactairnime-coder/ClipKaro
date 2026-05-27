import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, role, upiId } = await request.json()

    if (!role || !["CREATOR", "CLIPPER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const existing = await prisma.profile.findUnique({ where: { id: user.id } })
    if (existing) {
      return NextResponse.json(existing)
    }

    const profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email!,
        name: name || user.user_metadata?.full_name || null,
        avatar: user.user_metadata?.avatar_url || null,
        role,
        upiId: upiId || null,
      },
    })

    if (role === "CREATOR") {
      await prisma.creatorProfile.create({
        data: { userId: profile.id },
      }).catch(() => {})
    }

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("Complete profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
