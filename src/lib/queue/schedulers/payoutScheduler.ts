import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getPayoutQueue } from "../queues"

export function startPayoutScheduler() {
  cron.schedule("30 0 * * *", async () => {
    console.log("[PayoutScheduler] Processing pending payouts...")

    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const pendingPayouts = await prisma.payout.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: oneDayAgo },
      },
      select: { id: true },
    })

    const jobs = pendingPayouts.map((payout) => ({
      name: "payout",
      data: { payoutId: payout.id },
    }))
    if (jobs.length > 0) {
      await getPayoutQueue().addBulk(jobs)
    }

    console.log(`[PayoutScheduler] Queued ${jobs.length} payouts for processing`)
  })

  console.log("[PayoutScheduler] Scheduled at 00:30 daily")
}
