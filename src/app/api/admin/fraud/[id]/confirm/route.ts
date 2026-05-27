import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const flag = await prisma.fraudFlag.findUnique({
    where: { id: params.id },
    include: { submission: true },
  })

  if (!flag) return NextResponse.json({ error: "Flag not found" }, { status: 404 })

  await prisma.$transaction([
    prisma.submission.update({
      where: { id: flag.submissionId },
      data: { status: "REJECTED" },
    }),
    prisma.fraudFlag.update({
      where: { id: params.id },
      data: { isResolved: true },
    }),
  ])

  return NextResponse.json({ success: true })
}
