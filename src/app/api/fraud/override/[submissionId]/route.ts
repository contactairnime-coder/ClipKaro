import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-check"

export async function POST(request: Request, { params }: { params: { submissionId: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const { action: overrideAction, reason } = await request.json()
  if (!overrideAction || !["approve", "reject"].includes(overrideAction)) {
    return NextResponse.json({ error: "Invalid action. Must be 'approve' or 'reject'" }, { status: 400 })
  }

  const submission = await prisma.submission.findUnique({
    where: { id: params.submissionId },
    include: { campaign: true },
  })
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  }

  if (overrideAction === "approve") {
    const earnings = submission.earningsCalculated
    if (earnings > submission.campaign.remainingBounty) {
      return NextResponse.json({ error: "Insufficient campaign budget" }, { status: 400 })
    }
    await prisma.$transaction([
      prisma.submission.update({
        where: { id: params.submissionId },
        data: { status: "APPROVED" },
      }),
      prisma.campaign.update({
        where: { id: submission.campaignId, remainingBounty: { gte: earnings } },
        data: { remainingBounty: { decrement: earnings } },
      }),
      prisma.profile.update({
        where: { id: submission.clipperId },
        data: { totalEarned: { increment: earnings } },
      }),
      prisma.fraudFlag.updateMany({
        where: { submissionId: params.submissionId, isResolved: false },
        data: { isResolved: true },
      }),
    ])
  } else {
    await prisma.$transaction([
      prisma.submission.update({
        where: { id: params.submissionId },
        data: { status: "REJECTED", rejectionReason: reason || "Admin rejected for fraud" },
      }),
      prisma.fraudFlag.updateMany({
        where: { submissionId: params.submissionId, isResolved: false },
        data: { isResolved: true },
      }),
    ])
  }

  return NextResponse.json({ success: true, action: overrideAction })
}
