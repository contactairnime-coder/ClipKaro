import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [creators, clippers, activeCampaigns, submissionsToday, viewsToday, platformRevenue, pendingPayouts, totalBounty, recentActivity] = await Promise.all([
    prisma.profile.count({ where: { role: "CREATOR" } }),
    prisma.profile.count({ where: { role: "CLIPPER" } }),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.submission.count({ where: { createdAt: { gte: today } } }),
    prisma.submission.aggregate({ where: { createdAt: { gte: today } }, _sum: { viewCount: true } }),
    prisma.transaction.aggregate({ where: { type: "PLATFORM_FEE" }, _sum: { amount: true } }),
    prisma.payout.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
    prisma.campaign.aggregate({ where: { status: { in: ["ACTIVE", "PAUSED"] } }, _sum: { remainingBounty: true } }),
    prisma.$transaction([
      prisma.profile.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true, creator: { select: { name: true } } } }),
      prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, status: true, createdAt: true, campaign: { select: { title: true } }, clipper: { select: { name: true } } } }),
      prisma.fraudFlag.findMany({ where: { isResolved: false }, orderBy: { createdAt: "desc" }, take: 5, include: { submission: { select: { id: true } } } }),
    ]),
  ])

  const [newProfiles, newCampaigns, newSubmissions, fraudFlags] = recentActivity

  return NextResponse.json({
    stats: {
      creators,
      clippers,
      activeCampaigns,
      submissionsToday,
      viewsToday: viewsToday._sum.viewCount || 0,
      platformRevenue: platformRevenue._sum.amount || 0,
      pendingPayouts: pendingPayouts._sum.amount || 0,
      totalBountyInEscrow: totalBounty._sum.remainingBounty || 0,
    },
    activity: {
      profiles: newProfiles,
      campaigns: newCampaigns,
      submissions: newSubmissions,
      fraudFlags,
    },
    charts: {
      dailySubmissions: await getDailyStats("submission"),
      dailyRevenue: await getDailyStats("revenue"),
    },
  })
}

async function getDailyStats(type: "submission" | "revenue") {
  const days = 7
  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const next = new Date(date)
    next.setDate(next.getDate() + 1)

    let count = 0
    if (type === "submission") {
      count = await prisma.submission.count({ where: { createdAt: { gte: date, lt: next } } })
    } else {
      const agg = await prisma.transaction.aggregate({
        where: { type: "PLATFORM_FEE", createdAt: { gte: date, lt: next } },
        _sum: { amount: true },
      })
      count = agg._sum.amount || 0
    }

    result.push({
      date: date.toISOString().slice(0, 10),
      count,
    })
  }
  return result
}
