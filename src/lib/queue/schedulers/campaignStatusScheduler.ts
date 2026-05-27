import cron from "node-cron"
import { prisma } from "@/lib/prisma"
import { getEmailQueue } from "../queues"

export function startCampaignStatusScheduler() {
  cron.schedule("20 * * * *", async () => {
    console.log("[CampaignScheduler] Checking campaign statuses...")
    let completed = 0
    let notified = 0

    const activeCampaigns = await prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      include: { creator: { select: { id: true, email: true, name: true } } },
    })

    const now = new Date()

    for (const campaign of activeCampaigns) {
      let shouldComplete = false

      if (campaign.endDate && campaign.endDate < now) {
        shouldComplete = true
      }

      if (campaign.remainingBounty < campaign.bountyPerLakhViews) {
        shouldComplete = true
      }

      if (shouldComplete) {
        await prisma.campaign.update({
          where: { id: campaign.id, status: "ACTIVE" },
          data: { status: "COMPLETED" },
        })
        completed++

        await getEmailQueue().add("campaign-completed", {
          type: "CAMPAIGN_ACTIVATED",
          to: campaign.creator.email,
          data: {
            campaignTitle: campaign.title,
            campaignId: campaign.id,
            reason: campaign.endDate && campaign.endDate < now ? "End date passed" : "Bounty exhausted",
          },
        })
        notified++
      }
    }

    console.log(`[CampaignScheduler] Completed ${completed} campaigns, notified ${notified} creators`)
  })

  console.log("[CampaignScheduler] Scheduled at :20 past every hour")
}
