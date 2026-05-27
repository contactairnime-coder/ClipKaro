import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const campaigns = await prisma.campaign.findMany({
    where: { status: "DRAFT" },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(campaigns)
}
