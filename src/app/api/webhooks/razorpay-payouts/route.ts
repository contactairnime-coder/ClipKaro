import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyWebhookSignature } from "@/lib/razorpay"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("x-razorpay-signature") || ""

  const isValid = verifyWebhookSignature(body, signature)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const payload = JSON.parse(body)

  try {
    switch (payload.event) {
      case "payout.processed": {
        const payoutEntity = payload.payload.payout.entity
        const payoutId = payoutEntity.id

        const existing = await prisma.payout.findFirst({
          where: { razorpayPayoutId: payoutId },
        })
        if (existing && existing.status !== "PAID") {
          await prisma.payout.update({
            where: { id: existing.id },
            data: { status: "PAID", paidAt: new Date() },
          })

          await prisma.submission.updateMany({
            where: {
              clipperId: existing.clipperId,
              status: "APPROVED",
              earningsCalculated: { gt: 0 },
            },
            data: { status: "PAID" },
          })
        }
        break
      }

      case "payout.failed": {
        const payoutEntity = payload.payload.payout.entity
        const payoutId = payoutEntity.id

        const existing = await prisma.payout.findFirst({
          where: { razorpayPayoutId: payoutId },
        })
        if (existing && existing.status !== "FAILED") {
          await prisma.$transaction(async (tx) => {
            const [profile] = await tx.$queryRawUnsafe<Array<{ total_withdrawn: number }>>(
              `SELECT total_withdrawn FROM profiles WHERE id = $1 FOR UPDATE`,
              existing.clipperId
            )
            if (!profile) return
            const amount = existing.amount
            const withdrawn = Number(profile.total_withdrawn)
            if (withdrawn >= amount) {
              await tx.payout.update({
                where: { id: existing.id },
                data: { status: "FAILED" },
              })
              await tx.$executeRawUnsafe(
                `UPDATE profiles SET total_withdrawn = total_withdrawn - $1 WHERE id = $2 AND total_withdrawn >= $1`,
                amount,
                existing.clipperId
              )
            }
          })
        }
        break
      }
    }
  } catch (err) {
    console.error("Payout webhook error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
