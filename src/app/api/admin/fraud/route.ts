import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET(request: Request) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { searchParams } = new URL(request.url)
  const where = { isResolved: false }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const skip = (page - 1) * limit

  const flags = await prisma.fraudFlag.findMany({
    where,
    skip,
    take: limit,
    include: {
      submission: {
        include: {
          campaign: { select: { title: true } },
          clipper: { select: { id: true, name: true, email: true } },
          snapshots: { orderBy: { recordedAt: "desc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const total = await prisma.fraudFlag.count({ where })

  return NextResponse.json({ flags, pagination: { page, limit, total } })
}
