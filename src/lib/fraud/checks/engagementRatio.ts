import { prisma } from "@/lib/prisma"
import { getYouTubeStats } from "@/lib/youtube"
import { getInstagramStats } from "@/lib/instagram"
import { getTikTokStats } from "@/lib/tiktok"

type EngagementResult = {
  score: number
  details: string | null
  flagged: boolean
}

export async function checkEngagementRatio(submissionId: string): Promise<EngagementResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  })
  if (!submission) {
    return { score: 0, details: "Submission not found", flagged: false }
  }

  let viewCount = submission.viewCount
  let likeCount = 0
  let commentCount = 0

  const platformStats = await getPlatformStats(submission.platform, submission.submittedUrl)
  if (platformStats) {
    viewCount = platformStats.viewCount || viewCount
    likeCount = platformStats.likeCount || 0
    commentCount = platformStats.commentCount || 0
  }

  if (viewCount === 0) {
    return { score: 0, details: "No views to check engagement", flagged: false }
  }

  const likeRatio = (likeCount / viewCount) * 100
  const commentRatio = (commentCount / viewCount) * 100

  let score = 0
  const issues: string[] = []

  if (likeRatio < 1) {
    score += 25
    issues.push(`Low like ratio: ${likeRatio.toFixed(2)}% (< 1%)`)
  }

  if (commentRatio < 0.1) {
    score += 15
    issues.push(`Low comment ratio: ${commentRatio.toFixed(2)}% (< 0.1%)`)
  }

  if (score > 0) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "ENGAGEMENT_RATIO",
        details: `Likes: ${likeRatio.toFixed(2)}%, Comments: ${commentRatio.toFixed(2)}%. ${issues.join("; ")}`,
      },
    })
    return { score, details: issues.join("; "), flagged: true }
  }

  return {
    score: 0,
    details: `Normal engagement — like ratio: ${likeRatio.toFixed(2)}%, comment ratio: ${commentRatio.toFixed(2)}%`,
    flagged: false,
  }
}

async function getPlatformStats(platform: string, url: string) {
  switch (platform) {
    case "YOUTUBE_SHORTS":
      return getYouTubeStats(url)
    case "INSTAGRAM_REELS":
      return getInstagramStats(url)
    case "TIKTOK":
      return getTikTokStats(url)
    default:
      return null
  }
}
