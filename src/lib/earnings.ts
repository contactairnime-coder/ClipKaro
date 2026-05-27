import { prisma } from "./prisma"

export function calculateEarnings(viewCount: number, bountyPerLakhViews: number): number {
  return (viewCount / 100000) * bountyPerLakhViews
}

export async function finalizeEarnings(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  })
  if (!submission) return
  if (submission.status !== "PENDING") return

  await prisma.$transaction([
    prisma.submission.update({
      where: { id: submissionId },
      data: { status: "APPROVED" },
    }),
    prisma.campaign.update({
      where: { id: submission.campaignId },
      data: { remainingBounty: { decrement: submission.earningsCalculated } },
    }),
    prisma.profile.update({
      where: { id: submission.clipperId },
      data: { totalEarned: { increment: submission.earningsCalculated } },
    }),
  ])
}
