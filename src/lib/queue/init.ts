import { createViewSyncWorker } from "./workers/viewSyncWorker"
import { createFraudCheckWorker } from "./workers/fraudCheckWorker"
import { createEarningsWorker } from "./workers/earningsWorker"
import { createEmailWorker } from "./workers/emailWorker"
import { createPayoutWorker } from "./workers/payoutWorker"
import { startViewSyncScheduler } from "./schedulers/viewSyncScheduler"
import { startCampaignStatusScheduler } from "./schedulers/campaignStatusScheduler"
import { startPayoutScheduler } from "./schedulers/payoutScheduler"
import { closeAllQueues } from "./queues"
import type { Worker } from "bullmq"

const workers: Worker[] = []

export function startQueues() {
  console.log("[Queue] Starting workers and schedulers...")

  workers.push(
    createViewSyncWorker(),
    createFraudCheckWorker(),
    createEarningsWorker(),
    createEmailWorker(),
    createPayoutWorker()
  )

  startViewSyncScheduler()
  startCampaignStatusScheduler()
  startPayoutScheduler()

  console.log(`[Queue] ${workers.length} workers started, 3 schedulers started`)
}

export async function stopQueues() {
  console.log("[Queue] Shutting down...")

  for (const worker of workers) {
    await worker.close()
  }
  workers.length = 0

  await closeAllQueues()

  console.log("[Queue] Shutdown complete")
}
