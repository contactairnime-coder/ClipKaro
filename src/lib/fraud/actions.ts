import { prisma } from "@/lib/prisma"
import type { FraudRecommendation } from "./scoreCalculator"

type FraudActionResult = {
  submissionId: string
  action: FraudRecommendation
  details: string
}

export async function handleFraudResult(
  submissionId: string,
  score: number,
  recommendation: FraudRecommendation
): Promise<FraudActionResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { clipper: true, campaign: true },
  })
  if (!submission) {
    return { submissionId, action: "flag", details: "Submission not found" }
  }

  switch (recommendation) {
    case "safe": {
      if (submission.status === "PENDING") {
        await prisma.submission.update({
          where: { id: submissionId },
          data: {
            status: "APPROVED",
            earningsCalculated: submission.earningsCalculated,
          },
        })

        const earnings = submission.earningsCalculated
        if (earnings <= submission.campaign.remainingBounty) {
          await prisma.$transaction([
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
      }
      return {
        submissionId,
        action: "safe",
        details: `Score ${score}: Auto-approved — no fraud indicators`,
      }
    }

    case "flag": {
      await prisma.submission.update({
        where: { id: submissionId },
        data: { status: "PENDING" },
      })
      return {
        submissionId,
        action: "flag",
        details: `Score ${score}: Flagged for admin review — suspicious activity detected`,
      }
    }

    case "reject": {
      const fraudFlags = await prisma.fraudFlag.count({
        where: { submissionId, isResolved: false },
      })

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: "REJECTED",
          rejectionReason: `Auto-rejected (fraud score: ${score}): ${getFraudReason(fraudFlags)}`,
        },
      })

      if (fraudFlags >= 2) {
        await prisma.profile.update({
          where: { id: submission.clipperId },
          data: { isVerified: false },
        })
      }

      return {
        submissionId,
        action: "reject",
        details: `Score ${score}: Auto-rejected — fraudulent activity confirmed`,
      }
    }
  }
}

function getFraudReason(flagCount: number): string {
  if (flagCount >= 3) return "Multiple fraud indicators detected"
  if (flagCount === 2) return "Suspicious activity pattern detected"
  return "Unnatural view growth detected"
}
