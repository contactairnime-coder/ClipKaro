import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"
import type { Prisma, TransactionType } from "@prisma/client"

export async function GET(request: Request) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const skip = (page - 1) * limit

  const where: Prisma.TransactionWhereInput = {}
  if (type) where.type = type as TransactionType

  const transactions = await prisma.transaction.findMany({
    where,
    skip,
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  const total = await prisma.transaction.count({ where })

  const summary = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  })

  return NextResponse.json({ transactions, summary, pagination: { page, limit, total } })
}
