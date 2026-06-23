import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { prisma } from "@/lib/prisma"

export function createAutoApproveWorker() {
  const worker = new Worker<{ submissionId: string }>(
    "auto-approve",
    async (job) => {
      const { submissionId } = job.data
      console.log(`[AutoApproveWorker] Checking ${submissionId}`)

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { campaign: true, fraudFlags: { where: { isResolved: false } } },
      })
      if (!submission) throw new Error("Submission not found")
      if (submission.status !== "PENDING") return { skipped: true, reason: "Already processed" }

      const fraudFlags = submission.fraudFlags
      if (fraudFlags.length > 0) return { skipped: true, reason: "Has unresolved fraud flags" }

      const campaign = submission.campaign
      const earnings = submission.earningsCalculated
      if (earnings > campaign.remainingBounty) {
        return { skipped: true, reason: "Insufficient campaign budget" }
      }

      const autoApproveHours = campaign.autoApproveHours ?? 48
      if (autoApproveHours === 0) return { skipped: true, reason: "Auto-approve disabled" }

      const cutoff = new Date()
      cutoff.setHours(cutoff.getHours() - autoApproveHours)
      if (submission.createdAt > cutoff) return { skipped: true, reason: "Not yet due for auto-approve" }

      await prisma.$transaction([
        prisma.submission.update({
          where: { id: submissionId },
          data: { status: "APPROVED" },
        }),
        prisma.campaign.update({
          where: { id: campaign.id, remainingBounty: { gte: earnings } },
          data: { remainingBounty: { decrement: earnings } },
        }),
        prisma.profile.update({
          where: { id: submission.clipperId },
          data: { totalEarned: { increment: earnings } },
        }),
      ])

      console.log(`[AutoApproveWorker] Auto-approved ${submissionId}`)
      return { approved: true, submissionId }
    },
    {
      connection: getRedisConnection(),
      concurrency: 10,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[AutoApproveWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
