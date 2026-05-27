import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const flags = await prisma.fraudFlag.findMany({
    where: { isResolved: false },
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

  return NextResponse.json(flags)
}
