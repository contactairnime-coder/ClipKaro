import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getPayoutQueue } from "../queues"

export function startPayoutScheduler() {
  cron.schedule("0 0 * * *", async () => {
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

    for (const payout of pendingPayouts) {
      await getPayoutQueue().add("payout", { payoutId: payout.id })
    }

    console.log(`[PayoutScheduler] Queued ${pendingPayouts.length} payouts for processing`)
  })

  console.log("[PayoutScheduler] Scheduled daily at midnight")
}
