import { Queue } from "bullmq"
import { getRedisConnection } from "./redis"

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential" as const, delay: 2000 },
}

let viewSyncQueue: Queue
let fraudCheckQueue: Queue
let earningsQueue: Queue
let emailQueue: Queue
let payoutQueue: Queue
let autoApproveQueue: Queue

function getConnection() {
  return { connection: getRedisConnection(), defaultJobOptions }
}

export function getViewSyncQueue() {
  if (!viewSyncQueue) viewSyncQueue = new Queue("view-sync", getConnection())
  return viewSyncQueue
}

export function getFraudCheckQueue() {
  if (!fraudCheckQueue) fraudCheckQueue = new Queue("fraud-check", getConnection())
  return fraudCheckQueue
}

export function getEarningsQueue() {
  if (!earningsQueue) earningsQueue = new Queue("earnings", getConnection())
  return earningsQueue
}

export function getEmailQueue() {
  if (!emailQueue) emailQueue = new Queue("email", getConnection())
  return emailQueue
}

export function getPayoutQueue() {
  if (!payoutQueue) payoutQueue = new Queue("payout", getConnection())
  return payoutQueue
}

export function getAutoApproveQueue() {
  if (!autoApproveQueue) autoApproveQueue = new Queue("auto-approve", getConnection())
  return autoApproveQueue
}

export async function closeAllQueues() {
  const queues = [viewSyncQueue, fraudCheckQueue, earningsQueue, emailQueue, payoutQueue, autoApproveQueue].filter(Boolean)
  await Promise.all(queues.map((q) => q!.close()))
}
