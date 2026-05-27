import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const payout = await prisma.payout.findUnique({ where: { id: params.id } })
  if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 })

  const [updated] = await prisma.$transaction([
    prisma.payout.update({
      where: { id: params.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.profile.update({
      where: { id: payout.clipperId },
      data: { totalWithdrawn: { increment: payout.amount } },
    }),
    prisma.submission.updateMany({
      where: { clipperId: payout.clipperId, status: "APPROVED" },
      data: { status: "PAID" },
    }),
  ])

  return NextResponse.json(updated)
}
