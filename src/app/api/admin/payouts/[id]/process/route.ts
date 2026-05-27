import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"
import { createPayout } from "@/lib/razorpay"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const payout = await prisma.payout.findUnique({
    where: { id: params.id },
    include: { clipper: true },
  })
  if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 })
  if (payout.status !== "PENDING") {
    return NextResponse.json({ error: "Payout already processed" }, { status: 400 })
  }

  const clipperName = payout.clipper.name || payout.clipper.email || "ClipKaro User"
  const referenceId = `payout_${payout.id.slice(0, 12)}`

  try {
    const razorpayPayout = await createPayout(
      Math.round(payout.amount * 100),
      payout.upiId,
      clipperName,
      referenceId,
      { payoutId: payout.id }
    )

    await prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: "PROCESSING",
        razorpayPayoutId: razorpayPayout.id,
      },
    })

    return NextResponse.json({ success: true, razorpayPayoutId: razorpayPayout.id })
  } catch (err: unknown) {
    console.error("Razorpay payout error:", err)
    const message = err instanceof Error ? err.message : "Payout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
