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

    const payout = await prisma.$transaction(async (tx) => {
      const profiles = await tx.$queryRawUnsafe<Array<{ total_earned: number; total_withdrawn: number }>>(
        `SELECT total_earned, total_withdrawn FROM profiles WHERE id = $1 FOR UPDATE`,
        user.id
      )
      if (!profiles.length) throw new Error("Profile not found")

      const profile = profiles[0]
      const available = Number(profile.total_earned) - Number(profile.total_withdrawn)
      if (Number(amount) > available) {
        throw new Error("Insufficient balance")
      }

      await tx.$executeRawUnsafe(
        `UPDATE profiles SET total_withdrawn = total_withdrawn + $1 WHERE id = $2`,
        Number(amount),
        user.id
      )

      const payout = await tx.payout.create({
        data: {
          clipperId: user.id,
          amount: Number(amount),
          upiId,
          status: "PENDING",
        },
      })

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "WITHDRAWAL",
          amount: Number(amount),
          referenceId: payout.id,
        },
      })

      return payout
    })

    return NextResponse.json(payout, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    if (message === "Insufficient balance" || message === "Profile not found") {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    console.error("Withdraw error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
