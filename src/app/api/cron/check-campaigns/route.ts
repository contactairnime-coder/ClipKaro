import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  let completed = 0
  const errors: string[] = []

  const activeCampaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    include: { creator: { select: { email: true } } },
  })

  const now = new Date()

  for (const campaign of activeCampaigns) {
    try {
      let shouldComplete = false

      if (campaign.endDate && campaign.endDate < now) {
        shouldComplete = true
      }

      if (campaign.remainingBounty < campaign.bountyPerLakhViews) {
        shouldComplete = true
      }

      if (shouldComplete) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: "COMPLETED" },
        })
        completed++
      }
    } catch (err) {
      errors.push(`Campaign ${campaign.id}: ${err}`)
    }
  }

  return NextResponse.json({
    completed,
    total: activeCampaigns.length,
    errors,
    timestamp: new Date().toISOString(),
  })
}
