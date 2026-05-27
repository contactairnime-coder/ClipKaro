import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { sendFraudAlert } from "@/lib/emails/fraudAlert"
import { sendRejectionEmail } from "@/lib/emails/submissionRejected"

type EmailJobData = {
  type: "FRAUD_ALERT" | "SUBMISSION_REJECTED" | "CAMPAIGN_ACTIVATED" | "PAYOUT_PROCESSED" | "WELCOME"
  to: string
  data: Record<string, unknown>
}

export function createEmailWorker() {
  const worker = new Worker<EmailJobData>(
    "email",
    async (job) => {
      const { type, to, data } = job.data
      console.log(`[EmailWorker] Sending ${type} to ${to}`)

      switch (type) {
        case "FRAUD_ALERT":
          await sendFraudAlert({
            clipperName: String(data.clipperName || "Unknown"),
            submissionUrl: String(data.submissionUrl || ""),
            fraudScore: Number(data.score || 0),
            failedChecks: (data.failedChecks as string[]) || [],
            adminLink: String(data.adminLink || "/dashboard/admin/fraud"),
          })
          break

        case "SUBMISSION_REJECTED":
          await sendRejectionEmail({
            clipperEmail: to,
            clipperName: String(data.clipperName || "User"),
            campaignTitle: String(data.campaignTitle || ""),
            reason: String(data.reason || "Violation of campaign guidelines"),
            appealLink: String(data.appealLink || ""),
          })
          break

        case "CAMPAIGN_ACTIVATED":
          console.log(`[EmailWorker] Campaign activated email to ${to}`)
          break

        case "PAYOUT_PROCESSED":
          console.log(`[EmailWorker] Payout processed email to ${to}`)
          break

        case "WELCOME":
          console.log(`[EmailWorker] Welcome email to ${to}`)
          break
      }

      return { sent: true, type, to }
    },
    {
      connection: getRedisConnection(),
      concurrency: 3,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[EmailWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
