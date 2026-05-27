import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import type { SubmissionStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await prisma.profile.findUnique({ where: { id: user.id } })

    const pendingEarnings = await prisma.submission.aggregate({
      where: { clipperId: user.id, status: { in: ["PENDING", "APPROVED"] } },
      _sum: { earningsCalculated: true },
    })

    const paidEarnings = await prisma.submission.aggregate({
      where: { clipperId: user.id, status: "PAID" },
      _sum: { earningsCalculated: true },
    })

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    const historyStatus: SubmissionStatus[] = ["APPROVED", "PAID", "REJECTED"]
    const historyWhere = { clipperId: user.id, status: { in: historyStatus } }

    const history = await prisma.submission.findMany({
      where: historyWhere,
      skip,
      take: limit,
      include: { campaign: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.submission.count({ where: historyWhere })

    return NextResponse.json({
      totalEarned: profile?.totalEarned || 0,
      totalWithdrawn: profile?.totalWithdrawn || 0,
      pendingEarnings: pendingEarnings._sum.earningsCalculated || 0,
      paidEarnings: paidEarnings._sum.earningsCalculated || 0,
      history,
      pagination: { page, limit, total },
    })
  } catch (error) {
    console.error("Get earnings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
