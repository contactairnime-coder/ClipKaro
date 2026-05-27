import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { syncSubmissionViews } from "@/lib/viewSync"

export function startViewSyncJob() {
  cron.schedule("0 */6 * * *", async () => {
    console.log("[ViewSync] Starting scheduled sync...")

    const submissions = await prisma.submission.findMany({
      where: {
        status: { in: ["APPROVED", "PAID"] },
        campaign: { status: "ACTIVE" },
      },
      take: 50,
      orderBy: { lastSyncedAt: "asc" },
    })

    console.log(`[ViewSync] Syncing ${submissions.length} submissions`)

    let syncedCount = 0
    let totalViews = 0

    for (const submission of submissions) {
      try {
        const result = await syncSubmissionViews(submission.id)
        if (result.viewCount) {
          syncedCount++
          totalViews += result.viewCount
        }
      } catch (err) {
        console.error(`[ViewSync] Failed to sync ${submission.id}:`, err)
      }
    }

    console.log(`[ViewSync] Complete: ${syncedCount} synced, ${totalViews} total views`)
  })

  console.log("[ViewSync] Cron job scheduled (every 6 hours)")
}
