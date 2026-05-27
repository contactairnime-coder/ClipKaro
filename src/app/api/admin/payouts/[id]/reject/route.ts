import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const payout = await prisma.payout.findUnique({ where: { id: params.id } })
  if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 })
  if (payout.status !== "PENDING") {
    return NextResponse.json({ error: "Payout already processed" }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.payout.update({
      where: { id: params.id },
      data: { status: "FAILED" },
    }),
    prisma.profile.update({
      where: { id: payout.clipperId },
      data: { totalWithdrawn: { decrement: payout.amount } },
    }),
  ])

  return NextResponse.json({ success: true })
}
