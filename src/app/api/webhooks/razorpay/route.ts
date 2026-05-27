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

  const event = JSON.parse(body)

  try {
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity
        const notes = payment.notes || {}
        const userId = notes.userId
        const campaignId = notes.campaignId
        const bountyAmount = Number(notes.bountyAmount || 0)
        const platformFee = Number(notes.platformFee || 0)

        if (userId) {
          const existing = await prisma.transaction.findFirst({
            where: { referenceId: payment.id, type: "CREATOR_DEPOSIT" },
          })
          if (!existing) {
            await prisma.$transaction([
              prisma.transaction.create({
                data: { userId, type: "CREATOR_DEPOSIT", amount: bountyAmount, referenceId: payment.id },
              }),
              prisma.transaction.create({
                data: { userId, type: "PLATFORM_FEE", amount: platformFee, referenceId: payment.id },
              }),
              prisma.profile.update({
                where: { id: userId },
                data: { totalEarned: { increment: bountyAmount } },
              }),
            ])
          }
          if (campaignId) {
            await prisma.campaign.update({
              where: { id: campaignId },
              data: { status: "ACTIVE" },
            })
          }
        }
        break
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity
        console.error("Payment failed:", payment.id, payment.error_description)
        break
      }

      case "refund.created": {
        const refund = event.payload.refund.entity
        const paymentId = refund.payment_id

        const transactions = await prisma.transaction.findMany({
          where: { referenceId: paymentId },
        })
        for (const tx of transactions) {
          await prisma.profile.update({
            where: { id: tx.userId },
            data: { totalEarned: { decrement: tx.amount } },
          })
        }
        break
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
