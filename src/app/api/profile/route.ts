import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { name, upiId } = body

    const data: Record<string, string> = {}
    if (name !== undefined) data.name = name
    if (upiId !== undefined) data.upiId = upiId

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
