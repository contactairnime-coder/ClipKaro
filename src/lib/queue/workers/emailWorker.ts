import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { sendFraudAlert } from "@/lib/emails/fraudAlert"
import { sendRejectionEmail } from "@/lib/emails/submissionRejected"
import { sendEmail } from "@/lib/emails/send"

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
          await sendEmail({
            to,
            subject: `[Clipr] Campaign Activated — ${String(data.campaignTitle || "")}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#059669;">Campaign Live!</h2>
              <p>Your campaign <strong>${String(data.campaignTitle)}</strong> is now active.</p>
              <p>Clippers can now submit their clips. Track progress in your dashboard.</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://clipr.in"}/dashboard/creator/campaigns/${String(data.campaignId || "")}" style="display:inline-block;background:#059669;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">View Campaign</a></p>
            </div>`,
          })
          break

        case "PAYOUT_PROCESSED":
          await sendEmail({
            to,
            subject: `[Clipr] Payout Processed — ₹${Number(data.amount || 0).toLocaleString()}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#059669;">Payout Processed!</h2>
              <p>Your payout of <strong>₹${Number(data.amount || 0).toLocaleString()}</strong> has been processed.</p>
              <p>It should arrive in your UPI account (<strong>${String(data.upiId || "")}</strong>) shortly.</p>
            </div>`,
          })
          break

        case "WELCOME":
          await sendEmail({
            to,
            subject: `Welcome to Clipr! Start Earning Today`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#059669;">Welcome to Clipr!</h2>
              <p>You've joined India's first clipping platform.</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://clipr.in"}/dashboard" style="display:inline-block;background:#059669;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">Go to Dashboard</a></p>
            </div>`,
          })
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
