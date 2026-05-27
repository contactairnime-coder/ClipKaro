import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPayoutQueue } from "@/lib/queue/queues"

export async function GET(request: Request) {
  const secret = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace("Bearer ", "")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const pendingPayouts = await prisma.payout.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: oneDayAgo },
    },
    select: { id: true },
  })

  let queued = 0
  for (const payout of pendingPayouts) {
    await getPayoutQueue().add("payout", { payoutId: payout.id })
    queued++
  }

  return NextResponse.json({
    queued,
    totalPending: pendingPayouts.length,
    timestamp: new Date().toISOString(),
  })
}
