import { prisma } from "./prisma"
import { getYouTubeStats } from "./youtube"
import { getInstagramStats } from "./instagram"
import { getTikTokStats } from "./tiktok"
import { calculateEarnings, checkBountyAvailable } from "./earnings"
import { runFraudChecks } from "./fraud/detector"
import { handleFraudResult } from "./fraud/actions"

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
    const bountyCheck = await checkBountyAvailable(submission.campaignId, newEarnings - submission.earningsCalculated)
    if (bountyCheck.available) {
      await prisma.campaign.update({
        where: { id: submission.campaignId },
        data: { remainingBounty: { decrement: newEarnings - submission.earningsCalculated } },
      })
      await prisma.profile.update({
        where: { id: submission.clipperId },
        data: { totalEarned: { increment: newEarnings - submission.earningsCalculated } },
      })
    }
  }

  if (submission.status === "PENDING") {
    const fraudResult = await runFraudChecks(submissionId)
    await handleFraudResult(submissionId, fraudResult.score, fraudResult.recommendation)
  }

  return {
    viewCount: newViewCount,
    earningsCalculated: newEarnings,
    previousViewCount: submission.viewCount,
    snapshotId: snapshot.id,
  }
}
