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
        if (existing) {
          await prisma.payout.update({
            where: { id: existing.id },
            data: { status: "PAID", paidAt: new Date() },
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
        if (existing) {
          await prisma.$transaction([
            prisma.payout.update({
              where: { id: existing.id },
              data: { status: "FAILED" },
            }),
            prisma.profile.update({
              where: { id: existing.clipperId },
              data: { totalWithdrawn: { decrement: existing.amount } },
            }),
          ])
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
