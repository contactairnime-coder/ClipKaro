import { prisma } from "@/lib/prisma"

type DuplicateResult = {
  score: number
  details: string | null
  flagged: boolean
}

export async function checkDuplicate(submissionId: string): Promise<DuplicateResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { campaign: true },
  })
  if (!submission) {
    return { score: 0, details: "Submission not found", flagged: false }
  }

  const sameUrl = await prisma.submission.findFirst({
    where: {
      submittedUrl: submission.submittedUrl,
      id: { not: submissionId },
    },
  })

  if (sameUrl) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "DUPLICATE",
        details: `Same URL submitted by another clipper: ${submission.submittedUrl}`,
      },
    })
    return { score: 100, details: "Duplicate URL found — auto rejecting", flagged: true }
  }

  const clipperSubmissions = await prisma.submission.count({
    where: {
      clipperId: submission.clipperId,
      campaignId: submission.campaignId,
      id: { not: submissionId },
    },
  })

  if (clipperSubmissions >= 3) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "DUPLICATE",
        details: `Clipper submitted ${clipperSubmissions + 1} times to this campaign`,
      },
    })
    return { score: 30, details: `Clipper has ${clipperSubmissions + 1} submissions in this campaign`, flagged: true }
  }

  return { score: 0, details: "No duplicates found", flagged: false }
}
