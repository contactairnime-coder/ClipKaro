import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

export default async function CampaignsList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || profile.role !== "CREATOR") redirect("/dashboard")

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: user.id },
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Campaigns</h1>
          <p className="text-muted-foreground">{campaigns.length} total campaigns</p>
        </div>
        <Link href="/dashboard/creator/campaigns/create">
          <Button>+ New Campaign</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">No campaigns yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first campaign to start getting clips.</p>
            <Link href="/dashboard/creator/campaigns/create">
              <Button className="mt-4">Create Campaign</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status] || "bg-gray-100 text-gray-800"}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{campaign.description}</p>
                  </div>
                  <Link href={`/dashboard/creator/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submissions</p>
                    <p className="font-medium">{campaign._count.submissions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">₹{campaign.bountyTotal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-medium">₹{campaign.remainingBounty.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
