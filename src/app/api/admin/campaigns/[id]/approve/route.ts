import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function PUT(request: Request, context: { params: { id: string } }) {
  return POST(request, context)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const campaign = await prisma.campaign.update({
    where: { id: params.id },
    data: { status: "ACTIVE" },
  })

  return NextResponse.json(campaign)
}
