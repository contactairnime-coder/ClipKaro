import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET(request: Request) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")))
  const skip = (page - 1) * limit

  const payouts = await prisma.payout.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { clipper: { select: { id: true, name: true, email: true } } },
  })

  const total = await prisma.payout.count()

  return NextResponse.json({ payouts, pagination: { page, limit, total } })
}
