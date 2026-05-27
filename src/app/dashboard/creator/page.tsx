import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CreatorHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { creatorProfile: true },
  })
  if (!profile || profile.role !== "CREATOR") redirect("/dashboard")

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: user.id },
    include: {
      _count: { select: { submissions: true } },
      submissions: { select: { viewCount: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = campaigns.filter((c) => c.status === "ACTIVE").length
  const paused = campaigns.filter((c) => c.status === "PAUSED").length
  const completed = campaigns.filter((c) => c.status === "COMPLETED").length
  const totalViews = campaigns.reduce((sum, c) => sum + c.submissions.reduce((s, sub) => s + sub.viewCount, 0), 0)
  const totalBountySpent = campaigns.reduce((sum, c) => sum + (c.bountyTotal - c.remainingBounty), 0)
  const totalBountyRemaining = campaigns.reduce((sum, c) => sum + c.remainingBounty, 0)

  const recentSubmissions = await prisma.submission.findMany({
    where: { campaign: { creatorId: user.id } },
    include: { campaign: { select: { title: true } }, clipper: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile.name || "Creator"}</h1>
          <p className="text-muted-foreground">Here&apos;s your campaign overview</p>
        </div>
        <Link href="/dashboard/creator/campaigns/create">
          <Button size="lg">+ Create Campaign</Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{active}</p>
            <p className="text-xs text-muted-foreground">{paused} paused · {completed} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bounty Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{totalBountySpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Of ₹{(totalBountySpent + totalBountyRemaining).toLocaleString()} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{totalBountyRemaining.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Available for campaigns</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet. Create a campaign to get started.</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{sub.clipper.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{sub.campaign.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{sub.viewCount} views</p>
                      <p className="text-xs text-muted-foreground">{sub.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg border p-3">
                <span className="text-sm">Total Campaigns</span>
                <span className="text-sm font-bold">{campaigns.length}</span>
              </div>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="text-sm">Total Submissions</span>
                <span className="text-sm font-bold">{campaigns.reduce((s, c) => s + c._count.submissions, 0)}</span>
              </div>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="text-sm">Avg Views/Submission</span>
                <span className="text-sm font-bold">
                  {campaigns.reduce((s, c) => s + c.submissions.reduce((s2, sub) => s2 + sub.viewCount, 0), 0) > 0
                    ? Math.round(campaigns.reduce((s, c) => s + c.submissions.reduce((s2, sub) => s2 + sub.viewCount, 0), 0) / campaigns.reduce((s, c) => s + c._count.submissions, 0))
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="text-sm">Platform Fee (15%)</span>
                <span className="text-sm font-bold">₹{campaigns.reduce((s, c) => s + c.platformFee, 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
