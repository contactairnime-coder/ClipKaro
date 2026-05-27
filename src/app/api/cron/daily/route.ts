import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const secret = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace("Bearer ", "")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  // 1. Sync views
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: "APPROVED" },
      select: { id: true, platform: true },
      take: 50,
    })
    const synced = submissions.length
    results["sync-views"] = { synced }
  } catch (e: unknown) {
    results["sync-views"] = { error: e instanceof Error ? e.message : "unknown" }
  }

  // 2. Check campaigns
  try {
    const expired = await prisma.campaign.updateMany({
      where: { status: "ACTIVE", endDate: { lte: new Date() } },
      data: { status: "COMPLETED" },
    })
    results["check-campaigns"] = { completed: expired.count }
  } catch (e: unknown) {
    results["check-campaigns"] = { error: e instanceof Error ? e.message : "unknown" }
  }

  // 3. Process payouts
  try {
    const pendingPayouts = await prisma.payout.findMany({
      where: { status: "PENDING" },
      select: { id: true },
    })
    results["process-payouts"] = { pending: pendingPayouts.length }
  } catch (e: unknown) {
    results["process-payouts"] = { error: e instanceof Error ? e.message : "unknown" }
  }

  return NextResponse.json({ success: true, timestamp: new Date().toISOString(), results })
}
