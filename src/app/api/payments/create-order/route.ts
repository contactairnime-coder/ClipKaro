import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { createOrder } from "@/lib/razorpay"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || profile.role !== "CREATOR") {
    return NextResponse.json({ error: "Only creators can add funds" }, { status: 403 })
  }

  const { amount, campaignId } = await request.json()

  if (!amount || amount < 1000) {
    return NextResponse.json({ error: "Minimum deposit is ₹1,000" }, { status: 400 })
  }

  const bountyAmount = amount
  const platformFee = Math.round(amount * 0.15)
  const totalAmount = bountyAmount + platformFee

  const receipt = `cr_${user.id.slice(0, 8)}_${Date.now()}`

  const order = await createOrder(totalAmount * 100, receipt, {
    userId: user.id,
    campaignId: campaignId || "",
    bountyAmount: String(bountyAmount),
    platformFee: String(platformFee),
  })

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    bountyAmount,
    platformFee,
  })
}
