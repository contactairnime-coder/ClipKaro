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

  const campaigns = await prisma.campaign.findMany({
    skip,
    take: limit,
    include: {
      creator: { select: { id: true, name: true, email: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const total = await prisma.campaign.count()

  return NextResponse.json({ campaigns, pagination: { page, limit, total } })
}
