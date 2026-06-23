import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getAutoApproveQueue } from "../queues"

export function startAutoApproveScheduler() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("[AutoApproveScheduler] Checking submissions for auto-approve...")

    const submissions = await prisma.submission.findMany({
      where: { status: "PENDING" },
      include: {
        campaign: { select: { autoApproveHours: true, id: true } },
        fraudFlags: { where: { isResolved: false }, select: { id: true } },
      },
    })

    const dueForApprove = submissions.filter((s) => {
      if (s.fraudFlags.length > 0) return false
      const hours = s.campaign.autoApproveHours ?? 48
      if (hours === 0) return false
      const cutoff = new Date()
      cutoff.setHours(cutoff.getHours() - hours)
      return s.createdAt <= cutoff
    })

    if (dueForApprove.length > 0) {
      const jobs = dueForApprove.map((s) => ({
        name: "auto-approve",
        data: { submissionId: s.id },
      }))
      await getAutoApproveQueue().addBulk(jobs)
    }

    console.log(`[AutoApproveScheduler] Queued ${dueForApprove.length} for auto-approve`)
  })

  console.log("[AutoApproveScheduler] Scheduled every 30 minutes")
}
