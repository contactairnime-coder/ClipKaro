import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function handleApprove(request: Request, params: { id: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { campaign: true },
  })

  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  if (submission.campaign.creatorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const earnings = Math.round(submission.viewCount * submission.campaign.bountyPerLakhViews / 100000)

  const [updated] = await prisma.$transaction([
    prisma.submission.update({
      where: { id: params.id },
      data: { status: "APPROVED", earningsCalculated: earnings },
    }),
    prisma.profile.update({
      where: { id: submission.clipperId },
      data: { totalEarned: { increment: earnings } },
    }),
    prisma.campaign.update({
      where: { id: submission.campaignId },
      data: { remainingBounty: { decrement: earnings } },
    }),
    prisma.transaction.create({
      data: {
        type: "CLIPPER_EARNING",
        amount: earnings,
        userId: submission.clipperId,
        referenceId: submission.id,
      },
    }),
  ])

  return NextResponse.json(updated)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleApprove(request, params)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  return handleApprove(request, params)
}
