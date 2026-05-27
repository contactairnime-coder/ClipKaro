import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const where = { creatorId: user.id }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    const campaigns = await prisma.campaign.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.campaign.count({ where })

    const result = campaigns.map((c) => ({
      ...c,
      totalSubmissions: c._count.submissions,
    }))

    return NextResponse.json({ campaigns: result, pagination: { page, limit, total } })
  } catch (error) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
