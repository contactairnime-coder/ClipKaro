import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { getEmailQueue } from "../queues"
import { prisma } from "@/lib/prisma"
import { getRazorpayInstance } from "@/lib/razorpay"

export function createPayoutWorker() {
  const worker = new Worker<{ payoutId: string }>(
    "payout",
    async (job) => {
      const { payoutId } = job.data
      console.log(`[PayoutWorker] Processing ${payoutId}`)

      const payout = await prisma.payout.findUnique({
        where: { id: payoutId },
        include: { clipper: true },
      })
      if (!payout) throw new Error("Payout not found")
      if (payout.status !== "PENDING") return { skipped: true, reason: "Already processed" }

      const updated = await prisma.payout.updateMany({
        where: { id: payoutId, status: "PENDING" },
        data: { status: "PROCESSING" },
      })
      if (updated.count === 0) {
        return { skipped: true, reason: "Already processed by another worker" }
      }

      const razorpay = getRazorpayInstance()
      const clipperName = payout.clipper.name || payout.clipper.email || "Clipr User"

      const razorpayPayout = await razorpay.api.post<Record<string, unknown>, { id: string }>({
        url: "/v1/payouts",
        data: {
          account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
          fund_account: {
            account_type: "vpa",
            vpa: { address: payout.upiId },
            contact: { name: clipperName, type: "customer" },
          },
          amount: Math.round(payout.amount * 100),
          currency: "INR",
          mode: "UPI",
          purpose: "payout",
          queue_if_low_balance: true,
          reference_id: `payout_${payout.id.slice(0, 12)}`,
        },
      })

      await prisma.payout.update({
        where: { id: payoutId },
        data: {
          razorpayPayoutId: razorpayPayout.id,
        },
      })

      await getEmailQueue().add("payout-processed", {
        type: "PAYOUT_PROCESSED",
        to: payout.clipper.email,
        data: { amount: payout.amount, upiId: payout.upiId },
      })

      console.log(`[PayoutWorker] Done ${payoutId}: razorpayId=${razorpayPayout.id}`)
      return { processed: true, razorpayPayoutId: razorpayPayout.id }
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[PayoutWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
