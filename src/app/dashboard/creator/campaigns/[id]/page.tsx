import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

const subStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PAID: "bg-blue-100 text-blue-800",
}

export default async function CampaignDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      submissions: {
        include: {
          clipper: { select: { id: true, name: true, email: true, avatar: true } },
          fraudFlags: true,
          snapshots: { orderBy: { recordedAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!campaign) redirect("/dashboard/creator/campaigns")
  if (campaign.creatorId !== user.id) redirect("/dashboard/creator/campaigns")

  const totalViews = campaign.submissions.reduce((s, sub) => s + sub.viewCount, 0)
  const totalPaidOut = campaign.submissions
    .filter((s) => s.status === "PAID")
    .reduce((s, sub) => s + sub.earningsCalculated, 0)

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/creator/campaigns" className="text-sm text-muted-foreground hover:underline">← Back to campaigns</Link>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status !== "COMPLETED" && (
            <form action={`/api/campaigns/${campaign.id}/toggle-status`} method="POST">
              <Button variant="outline" type="submit">
                {campaign.status === "ACTIVE" ? "Pause" : campaign.status === "PAUSED" ? "Resume" : "Activate"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Budget</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{campaign.bountyTotal.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Remaining</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{campaign.remainingBounty.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Views</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totalViews.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Paid Out</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{totalPaidOut.toLocaleString()}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions ({campaign.submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {campaign.submissions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No submissions yet. Share this campaign with clippers!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Clipper</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium">Views</th>
                    <th className="pb-3 font-medium">Earnings</th>
                    <th className="pb-3 font-medium">Last Synced</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.submissions.map((sub) => (
                    <tr key={sub.id} className="border-b last:border-0">
                      <td className="py-3">{sub.clipper.name || sub.clipper.email}</td>
                      <td className="py-3">
                        {sub.platform === "YOUTUBE_SHORTS" ? "YouTube" : sub.platform === "INSTAGRAM_REELS" ? "Instagram" : "TikTok"}
                      </td>
                      <td className="py-3">{sub.viewCount.toLocaleString()}</td>
                      <td className="py-3">₹{sub.earningsCalculated.toLocaleString()}</td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {sub.lastSyncedAt ? new Date(sub.lastSyncedAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${subStatusColors[sub.status]}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {sub.status === "PENDING" ? (
                          <div className="flex gap-1">
                            <form action={`/api/submissions/${sub.id}/approve`} method="POST">
                              <Button size="sm" variant="default">Approve</Button>
                            </form>
                            <form action={`/api/submissions/${sub.id}/reject`} method="POST">
                              <Button size="sm" variant="destructive">Reject</Button>
                            </form>
                          </div>
                        ) : sub.status === "REJECTED" && sub.rejectionReason ? (
                          <span className="text-xs text-muted-foreground">{sub.rejectionReason}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
