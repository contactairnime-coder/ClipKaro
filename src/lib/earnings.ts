import { prisma } from "./prisma"

export function calculateEarnings(viewCount: number, bountyPerLakhViews: number): number {
  return (viewCount / 100000) * bountyPerLakhViews
}

export async function checkBountyAvailable(campaignId: string, newEarnings: number): Promise<{ available: boolean; remaining: number }> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { remainingBounty: true, status: true },
  })

  if (!campaign) return { available: false, remaining: 0 }

  const remaining = campaign.remainingBounty - newEarnings

  if (remaining <= 0) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { remainingBounty: 0, status: "COMPLETED" },
    })
    return { available: false, remaining: 0 }
  }

  return { available: true, remaining }
}

export async function finalizeEarnings(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { campaign: true },
  })
  if (!submission) return

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
