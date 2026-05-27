import { prisma } from "./prisma"
import { getYouTubeStats } from "./youtube"
import { getInstagramStats } from "./instagram"
import { getTikTokStats } from "./tiktok"
import { calculateEarnings } from "./earnings"

export async function syncSubmissionViews(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { campaign: true },
  })
  if (!submission) return { error: "Submission not found" }

  let stats: { viewCount: number; likeCount: number; commentCount: number; error?: string }

  switch (submission.platform) {
    case "YOUTUBE_SHORTS":
      stats = await getYouTubeStats(submission.submittedUrl)
      break
    case "INSTAGRAM_REELS":
      stats = await getInstagramStats(submission.submittedUrl)
      break
    case "TIKTOK":
      stats = await getTikTokStats(submission.submittedUrl)
      break
    default:
      return { error: "Unknown platform" }
  }

  if (stats.error) {
    console.warn(`View sync warning for ${submissionId}: ${stats.error}`)

    await prisma.viewSnapshot.create({
      data: {
        submissionId,
        viewCount: submission.viewCount,
      },
    })

    return { error: stats.error, viewCount: submission.viewCount }
  }

  const newViewCount = stats.viewCount
  const newEarnings = calculateEarnings(newViewCount, submission.campaign.bountyPerLakhViews)

  const [snapshot] = await prisma.$transaction([
    prisma.viewSnapshot.create({
      data: {
        submissionId,
        viewCount: newViewCount,
      },
    }),
    prisma.submission.update({
      where: { id: submissionId },
      data: {
        viewCount: newViewCount,
        earningsCalculated: newEarnings,
        lastSyncedAt: new Date(),
      },
    }),
  ])

  if (submission.status === "APPROVED" || submission.status === "PAID") {
    const diff = newEarnings - submission.earningsCalculated
    if (diff <= 0) {
      return { viewCount: newViewCount, earningsCalculated: newEarnings, previousViewCount: submission.viewCount, snapshotId: snapshot.id }
    }

    const updated = await prisma.campaign.updateMany({
      where: { id: submission.campaignId, remainingBounty: { gte: diff } },
      data: { remainingBounty: { decrement: diff } },
    })
    if (updated.count > 0) {
      await prisma.profile.update({
        where: { id: submission.clipperId },
        data: { totalEarned: { increment: diff } },
      })
    } else {
      await prisma.campaign.update({
        where: { id: submission.campaignId, remainingBounty: { lt: diff } },
        data: { remainingBounty: 0, status: "COMPLETED" },
      })
      console.warn(`Bounty exhausted for campaign ${submission.campaignId}, earnings capped`)
    }
  }

  return {
    viewCount: newViewCount,
    earningsCalculated: newEarnings,
    previousViewCount: submission.viewCount,
    snapshotId: snapshot.id,
  }
}
