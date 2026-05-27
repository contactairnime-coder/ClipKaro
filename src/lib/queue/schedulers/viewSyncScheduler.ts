import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getViewSyncQueue } from "../queues"

export function startViewSyncScheduler() {
  cron.schedule("0 */6 * * *", async () => {
    console.log("[ViewSyncScheduler] Starting...")

    const submissions = await prisma.submission.findMany({
      where: {
        status: { in: ["APPROVED", "PAID"] },
        campaign: { status: "ACTIVE" },
      },
      select: { id: true },
      take: 100,
      orderBy: { lastSyncedAt: "asc" },
    })

    for (const sub of submissions) {
      await getViewSyncQueue().add("view-sync", { submissionId: sub.id })
    }

    console.log(`[ViewSyncScheduler] Queued ${submissions.length} submissions`)
  })

  console.log("[ViewSyncScheduler] Scheduled every 6 hours")
}
