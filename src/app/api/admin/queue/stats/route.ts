import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-check"
import { getViewSyncQueue, getFraudCheckQueue, getEarningsQueue, getEmailQueue, getPayoutQueue } from "@/lib/queue/queues"
import type { Queue } from "bullmq"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const queues = {
    viewSync: await getQueueStats(getViewSyncQueue()),
    fraudCheck: await getQueueStats(getFraudCheckQueue()),
    earnings: await getQueueStats(getEarningsQueue()),
    email: await getQueueStats(getEmailQueue()),
    payout: await getQueueStats(getPayoutQueue()),
  }

  const totalFailed = Object.values(queues).reduce((s, q) => s + q.failed, 0)

  return NextResponse.json({ queues, totalFailed })
}

async function getQueueStats(queue: Queue) {
  const counts = await queue.getJobCounts()
  const failedJobs = await queue.getJobs("failed", 0, 10)

  return {
    name: queue.name,
    waiting: counts.waiting || 0,
    active: counts.active || 0,
    completed: counts.completed || 0,
    failed: counts.failed || 0,
    delayed: counts.delayed || 0,
    recentFailures: failedJobs
      .filter((j) => j.failedReason)
      .map((j) => ({
        id: j.id,
        data: j.data,
        failedReason: j.failedReason,
        timestamp: j.timestamp,
      })),
  }
}
