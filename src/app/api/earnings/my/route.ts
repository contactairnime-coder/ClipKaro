import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    const history = await prisma.submission.findMany({
      where: { clipperId: user.id, status: { in: ["APPROVED", "PAID", "REJECTED"] } },
      include: { campaign: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({
      totalEarned: profile?.totalEarned || 0,
      totalWithdrawn: profile?.totalWithdrawn || 0,
      pendingEarnings: pendingEarnings._sum.earningsCalculated || 0,
      paidEarnings: paidEarnings._sum.earningsCalculated || 0,
      history,
    })
  } catch (error) {
    console.error("Get earnings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
