import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"
import { syncSubmissionViews } from "@/lib/viewSync"

export async function POST() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

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

  return NextResponse.json({ syncedCount, totalViews, errors, total: submissions.length })
}
