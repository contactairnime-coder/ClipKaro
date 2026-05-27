import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { verifyPaymentSignature } from "@/lib/razorpay"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, campaignId, bountyAmount, platformFee } = await request.json()

  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
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
  ])

  if (campaignId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "ACTIVE" },
    })
  }

  return NextResponse.json({ success: true, transactionId: transaction.id })
}
