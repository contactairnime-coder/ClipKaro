import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { getEmailQueue, getEarningsQueue } from "../queues"
import { runFraudChecks } from "@/lib/fraud/detector"
import { handleFraudResult } from "@/lib/fraud/actions"

export function createFraudCheckWorker() {
  const worker = new Worker<{ submissionId: string }>(
    "fraud-check",
    async (job) => {
      const { submissionId } = job.data
      console.log(`[FraudCheckWorker] Checking ${submissionId}`)

      const fraudResult = await runFraudChecks(submissionId)

      await handleFraudResult(submissionId, fraudResult.score, fraudResult.recommendation)

      if (fraudResult.recommendation === "reject" || fraudResult.recommendation === "flag") {
        await getEmailQueue().add("fraud-alert", {
          type: "FRAUD_ALERT",
          submissionId,
          score: fraudResult.score,
          failedChecks: fraudResult.checks.filter((c) => !c.passed).map((c) => c.name),
        })
      }

      if (fraudResult.recommendation === "safe") {
        await getEarningsQueue().add("earnings", { submissionId })
      }

      console.log(`[FraudCheckWorker] Done ${submissionId}: score=${fraudResult.score}, action=${fraudResult.recommendation}`)
      return fraudResult
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  )

  worker.on("failed", (job, err) => {
    console.error(`[FraudCheckWorker] Failed ${job?.id}:`, err.message)
  })

  return worker
}
