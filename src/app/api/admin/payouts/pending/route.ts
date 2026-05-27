import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const payouts = await prisma.payout.findMany({
    where: { status: "PENDING" },
    include: { clipper: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(payouts)
}
