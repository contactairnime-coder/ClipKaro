import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { finalizeEarnings } from "@/lib/earnings"

export function createEarningsWorker() {
  const worker = new Worker<{ submissionId: string }>(
    "earnings",
    async (job) => {
      const { submissionId } = job.data
      console.log(`[EarningsWorker] Finalizing ${submissionId}`)

      await finalizeEarnings(submissionId)

      console.log(`[EarningsWorker] Done ${submissionId}`)
      return { finalized: true }
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[EarningsWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
