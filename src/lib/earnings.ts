import { prisma } from "./prisma"

export function calculateEarnings(viewCount: number, bountyPerLakhViews: number): number {
  return (viewCount / 100000) * bountyPerLakhViews
}

export async function finalizeEarnings(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { campaign: true },
  })
  if (!submission) return
  if (submission.status !== "PENDING") return

  const earnings = submission.earningsCalculated
  if (earnings > submission.campaign.remainingBounty) return

  await prisma.$transaction([
    prisma.submission.update({
      where: { id: submissionId },
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
  ])
}
