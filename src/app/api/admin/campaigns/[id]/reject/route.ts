import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const campaign = await prisma.campaign.update({
    where: { id: params.id },
    data: { status: "COMPLETED" },
  })

  return NextResponse.json(campaign)
}
