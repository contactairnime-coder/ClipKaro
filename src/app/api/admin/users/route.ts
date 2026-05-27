import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true, campaigns: true } },
    },
  })

  return NextResponse.json(users)
}
