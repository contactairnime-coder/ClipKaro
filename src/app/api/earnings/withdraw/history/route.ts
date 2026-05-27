import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const where = { clipperId: user.id }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    const payouts = await prisma.payout.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.payout.count({ where })

    return NextResponse.json({ payouts, pagination: { page, limit, total } })
  } catch (error) {
    console.error("Get withdrawal history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
