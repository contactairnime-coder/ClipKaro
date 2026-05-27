import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { amount, upiId } = body

    if (!amount || amount < 500) {
      return NextResponse.json({ error: "Minimum withdrawal is ₹500" }, { status: 400 })
    }
    if (!upiId) {
      return NextResponse.json({ error: "UPI ID is required" }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({ where: { id: user.id } })
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    const availableBalance = profile.totalEarned - profile.totalWithdrawn
    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const payout = await prisma.payout.create({
      data: {
        clipperId: user.id,
        amount: Number(amount),
        upiId,
        status: "PENDING",
      },
    })

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "WITHDRAWAL",
        amount: Number(amount),
        referenceId: payout.id,
      },
    })

    return NextResponse.json(payout, { status: 201 })
  } catch (error) {
    console.error("Withdraw error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
