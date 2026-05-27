import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET(request: Request) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
  const skip = (page - 1) * limit

  const users = await prisma.profile.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true, campaigns: true } },
    },
  })

  const total = await prisma.profile.count()

  return NextResponse.json({ users, pagination: { page, limit, total } })
}
