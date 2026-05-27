import { prisma } from "@/lib/prisma"

type VelocityResult = {
  score: number
  details: string | null
  flagged: boolean
}

export async function checkViewVelocity(submissionId: string): Promise<VelocityResult> {
  const snapshots = await prisma.viewSnapshot.findMany({
    where: { submissionId },
    orderBy: { recordedAt: "desc" },
    take: 2,
  })

  if (snapshots.length < 2) {
    return { score: 0, details: "Not enough snapshots to check velocity", flagged: false }
  }

  const [latest, previous] = snapshots

  const timeDiffHours =
    (latest.recordedAt.getTime() - previous.recordedAt.getTime()) / (1000 * 60 * 60)

  if (timeDiffHours <= 0) {
    return { score: 0, details: "No time elapsed between snapshots", flagged: false }
  }

  const viewsGained = latest.viewCount - previous.viewCount
  const viewsPerHour = Math.round(viewsGained / timeDiffHours)

  if (viewsPerHour > 50000) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "VIEW_VELOCITY",
        details: `Unnatural growth: ${viewsPerHour.toLocaleString()} views/hour (> 50,000 limit)`,
      },
    })
    return { score: 40, details: `HIGH RISK: ${viewsPerHour.toLocaleString()} views/hour`, flagged: true }
  }

  if (viewsPerHour > 20000) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "VIEW_VELOCITY",
        details: `Suspicious growth: ${viewsPerHour.toLocaleString()} views/hour (20,000-50,000)`,
      },
    })
    return { score: 20, details: `MEDIUM RISK: ${viewsPerHour.toLocaleString()} views/hour`, flagged: true }
  }

  if (viewsPerHour > 10000) {
    await prisma.fraudFlag.create({
      data: {
        submissionId,
        flagType: "VIEW_VELOCITY",
        details: `Elevated growth: ${viewsPerHour.toLocaleString()} views/hour (10,000-20,000)`,
      },
    })
    return { score: 10, details: `LOW RISK: ${viewsPerHour.toLocaleString()} views/hour`, flagged: true }
  }

  return { score: 0, details: `Normal growth: ${viewsPerHour.toLocaleString()} views/hour`, flagged: false }
}
