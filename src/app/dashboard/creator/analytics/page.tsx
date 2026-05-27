"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  status: string
  viewCount: number
  submissions: { viewCount: number }[]
  _count: { submissions: number }
}

export default function CreatorAnalytics() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/campaigns/my")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCampaigns(data as Campaign[])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-64 animate-pulse rounded bg-muted" />
  }

  const totalViews = campaigns.reduce((s, c) => s + c.submissions.reduce((s2, sub) => s2 + sub.viewCount, 0), 0)
  const totalSubmissions = campaigns.reduce((s, c) => s + c._count.submissions, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length
  const pendingCampaigns = campaigns.filter((c) => c.status === "PENDING").length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your campaign performance</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSubmissions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{activeCampaigns}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{pendingCampaigns}</p>
          </CardContent>
        </Card>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No campaigns yet.</p>
            <Link href="/dashboard/creator/campaigns/create">
              <Button className="mt-4">Create your first campaign</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns.map((c) => {
                const views = c.submissions.reduce((s, sub) => s + sub.viewCount, 0)
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c._count.submissions} submissions · {c.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{views.toLocaleString()} views</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
