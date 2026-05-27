import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payouts = await prisma.payout.findMany({
      where: { clipperId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payouts)
  } catch (error) {
    console.error("Get withdrawal history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
