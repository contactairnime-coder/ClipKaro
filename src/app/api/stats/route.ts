import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [totalPaid, clippers, activeCampaigns] = await Promise.all([
      prisma.payout.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.profile.count({ where: { role: "CLIPPER" } }),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
    ])

    return NextResponse.json({
      totalPaid: totalPaid._sum.amount || 0,
      clippers,
      activeCampaigns,
      minPayout: 500,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
