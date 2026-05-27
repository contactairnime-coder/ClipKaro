import { prisma } from "@/lib/prisma"
import { getYouTubeStats } from "@/lib/youtube"

type AccountAgeResult = {
  score: number
  details: string | null
  flagged: boolean
}

export async function checkAccountAge(submissionId: string): Promise<AccountAgeResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { clipper: true, campaign: true },
  })
  if (!submission || !submission.clipper) {
    return { score: 0, details: "Submission or clipper not found", flagged: false }
  }

  const accountAgeDays = getAccountAgeDays(submission.clipper.createdAt)
  let score = 0

  if (accountAgeDays < 30) {
    score += 30
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "ACCOUNT_AGE",
        details: `Account only ${accountAgeDays} days old (< 30 days)`,
      },
    })
    return { score, details: `HIGH RISK: Account age ${accountAgeDays} days`, flagged: true }
  }

  if (accountAgeDays < 90) {
    score += 15
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "ACCOUNT_AGE",
        details: `Account ${accountAgeDays} days old (< 90 days)`,
      },
    })
    return { score, details: `MEDIUM RISK: Account age ${accountAgeDays} days`, flagged: true }
  }

  if (submission.platform === "YOUTUBE_SHORTS") {
    const stats = await getYouTubeStats(submission.submittedUrl)
    if (stats.viewCount > 0) {
      score += 0
    }
  }

  return { score: 0, details: `Account age: ${accountAgeDays} days — trusted`, flagged: false }
}

function getAccountAgeDays(createdAt: Date): number {
  const now = new Date()
  const diff = now.getTime() - createdAt.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
