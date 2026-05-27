"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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

      <motion.div
        className="mb-6 grid gap-4 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {[
          { title: "Total Views", value: totalViews.toLocaleString(), className: "" },
          { title: "Submissions", value: totalSubmissions.toString(), className: "" },
          { title: "Active Campaigns", value: activeCampaigns.toString(), className: "text-emerald-600" },
          { title: "Pending Approval", value: pendingCampaigns.toString(), className: "text-amber-600" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${stat.className}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
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
                {campaigns.map((c, index) => {
                  const views = c.submissions.reduce((s, sub) => s + sub.viewCount, 0)
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {c._count.submissions} submissions · {c.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{views.toLocaleString()} views</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
