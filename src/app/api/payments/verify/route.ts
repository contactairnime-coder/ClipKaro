import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { verifyPaymentSignature, fetchOrder } from "@/lib/razorpay"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, campaignId } = await request.json()

  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  const existing = await prisma.transaction.findFirst({
    where: { referenceId: razorpay_payment_id, type: "CREATOR_DEPOSIT" },
  })
  if (existing) {
    return NextResponse.json({ error: "Payment already processed" }, { status: 409 })
  }

  const order = await fetchOrder(razorpay_order_id)
  const bountyAmount = Number(order.notes.bountyAmount)
  const platformFee = Number(order.notes.platformFee)
  const orderCampaignId = order.notes.campaignId || ""
  const orderUserId = order.notes.userId

  if (orderUserId !== user.id) {
    return NextResponse.json({ error: "Order belongs to a different user" }, { status: 403 })
  }
  if (!bountyAmount || !platformFee) {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
  }
  if (order.amount !== (bountyAmount + platformFee) * 100) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
  }

  const effectiveCampaignId = campaignId || (orderCampaignId || null)
  if (effectiveCampaignId) {
    const campaign = await prisma.campaign.findUnique({ where: { id: effectiveCampaignId } })
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    if (campaign.creatorId !== user.id) {
      return NextResponse.json({ error: "You can only add funds to your own campaigns" }, { status: 403 })
    }
  }

  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "CREATOR_DEPOSIT",
        amount: bountyAmount,
        referenceId: razorpay_payment_id,
      },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "PLATFORM_FEE",
        amount: platformFee,
        referenceId: razorpay_payment_id,
      },
    }),
    prisma.profile.update({
      where: { id: user.id },
      data: { totalEarned: { increment: bountyAmount } },
    }),
    ...(effectiveCampaignId
      ? [prisma.campaign.update({
          where: { id: effectiveCampaignId },
          data: { status: "ACTIVE" },
        })]
      : []),
  ])

  return NextResponse.json({ success: true, transactionId: transaction.id })
}
