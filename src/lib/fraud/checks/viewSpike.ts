import { prisma } from "@/lib/prisma"

type ViewSpikeResult = {
  score: number
  details: string | null
  flagged: boolean
}

export async function checkViewSpike(submissionId: string): Promise<ViewSpikeResult> {
  const snapshots = await prisma.viewSnapshot.findMany({
    where: { submissionId },
    orderBy: { recordedAt: "asc" },
  })

  if (snapshots.length < 2) {
    return { score: 0, details: "Not enough snapshots to detect spikes", flagged: false }
  }

  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1]
    const curr = snapshots[i]

    const timeDiffHours =
      (curr.recordedAt.getTime() - prev.recordedAt.getTime()) / (1000 * 60 * 60)

    if (timeDiffHours <= 0) continue

    const viewsGained = curr.viewCount - prev.viewCount
    const growthMultiplier = prev.viewCount > 0 ? viewsGained / prev.viewCount : 0

    if (viewsGained > 0 && timeDiffHours <= 1 && growthMultiplier >= 10) {
      await prisma.fraudFlag.create({
        data: {
          submissionId,
          flagType: "VIEW_VELOCITY",
          details: `Unnatural spike: ${growthMultiplier.toFixed(1)}x growth in ${timeDiffHours.toFixed(1)} hour(s) (${viewsGained.toLocaleString()} views)`,
        },
      })
      return {
        score: 50,
        details: `HIGH RISK: ${growthMultiplier.toFixed(1)}x views spike in ${timeDiffHours.toFixed(1)} hour(s)`,
        flagged: true,
      }
    }

    if (viewsGained > 0 && timeDiffHours <= 2 && growthMultiplier >= 5) {
      await prisma.fraudFlag.create({
        data: {
          submissionId,
          flagType: "VIEW_VELOCITY",
          details: `Moderate spike: ${growthMultiplier.toFixed(1)}x growth in ${timeDiffHours.toFixed(1)} hours`,
        },
      })
      return {
        score: 25,
        details: `MEDIUM RISK: ${growthMultiplier.toFixed(1)}x views spike`,
        flagged: true,
      }
    }
  }

  return { score: 0, details: `Natural growth curve over ${snapshots.length} snapshots`, flagged: false }
}
