import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { getFraudCheckQueue } from "../queues"
import { syncSubmissionViews } from "@/lib/viewSync"

export function createViewSyncWorker() {
  const worker = new Worker<{ submissionId: string }>(
    "view-sync",
    async (job) => {
      const { submissionId } = job.data
      console.log(`[ViewSyncWorker] Syncing ${submissionId}`)

      const result = await syncSubmissionViews(submissionId)

      if (result.error) {
        throw new Error(result.error)
      }

      await getFraudCheckQueue().add("fraud-check", { submissionId })

      console.log(`[ViewSyncWorker] Done ${submissionId}: ${result.viewCount} views`)
      return result
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[ViewSyncWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
