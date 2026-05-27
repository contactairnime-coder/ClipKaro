import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getViewSyncQueue } from "../queues"

export function startViewSyncScheduler() {
  cron.schedule("10 */6 * * *", async () => {
    console.log("[ViewSyncScheduler] Starting...")

    const submissions = await prisma.submission.findMany({
      where: {
        status: { in: ["APPROVED", "PAID"] },
        campaign: { status: "ACTIVE" },
      },
      select: { id: true },
      take: 200,
      orderBy: { lastSyncedAt: "asc" },
    })

    const jobs = submissions.map((sub) => ({
      name: "view-sync",
      data: { submissionId: sub.id },
    }))
    await getViewSyncQueue().addBulk(jobs)

    console.log(`[ViewSyncScheduler] Queued ${jobs.length} submissions`)
  })

  console.log("[ViewSyncScheduler] Scheduled at :10 past every 6 hours")
}
