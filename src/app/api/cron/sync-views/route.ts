import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { syncSubmissionViews } from "@/lib/viewSync"

export async function GET(request: Request) {
  const secret = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace("Bearer ", "")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  const submissions = await prisma.submission.findMany({
    where: {
      status: { in: ["APPROVED", "PAID"] },
      campaign: { status: "ACTIVE" },
    },
    take: 50,
    orderBy: { lastSyncedAt: "asc" },
  })

  let syncedCount = 0
  let totalViews = 0
  const errors: string[] = []

  for (const submission of submissions) {
    try {
      const result = await syncSubmissionViews(submission.id)
      if (result.viewCount) {
        syncedCount++
        totalViews += result.viewCount
      }
      if (result.error) errors.push(result.error)
    } catch {
      errors.push(`Error syncing ${submission.id}`)
    }
  }

  return NextResponse.json({ syncedCount, totalViews, errors, timestamp: new Date().toISOString() })
}
