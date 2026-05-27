"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Campaign = {
  id: string
  title: string
  status: string
  bountyTotal: number
  remainingBounty: number
  platformFee: number
  _count: { submissions: number }
  submissions: { viewCount: number }[]
}

type Submission = {
  id: string
  viewCount: number
  status: string
  campaign: { title: string }
  clipper: { name: string | null }
}

export default function CreatorHome() {
  const [name, setName] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [profileRes, campaignsRes, submissionsRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/campaigns/my"),
        fetch("/api/submissions/my?recent=true&limit=5"),
      ])
      const profile = await profileRes.json()
      if (profile?.name) setName(profile.name)
      if (campaignsRes.ok) {
        const data = await campaignsRes.json()
        if (Array.isArray(data)) setCampaigns(data)
      }
      if (submissionsRes.ok) {
        const data = await submissionsRes.json()
        if (Array.isArray(data)) setRecentSubmissions(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="h-64 animate-pulse rounded bg-muted" />
  }

  const active = campaigns.filter((c) => c.status === "ACTIVE").length
  const paused = campaigns.filter((c) => c.status === "PAUSED").length
  const completed = campaigns.filter((c) => c.status === "COMPLETED").length
  const totalViews = campaigns.reduce((sum, c) => sum + c.submissions.reduce((s, sub) => s + sub.viewCount, 0), 0)
  const totalBountySpent = campaigns.reduce((sum, c) => sum + (c.bountyTotal - c.remainingBounty), 0)
  const totalBountyRemaining = campaigns.reduce((sum, c) => sum + c.remainingBounty, 0)
  const totalSubmissions = campaigns.reduce((s, c) => s + c._count.submissions, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {name || "Creator"}</h1>
          <p className="text-muted-foreground">Here&apos;s your campaign overview</p>
        </div>
        <Link href="/dashboard/creator/campaigns/create">
          <Button size="lg">+ Create Campaign</Button>
        </Link>
      </div>

      <motion.div
        className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {[
          { title: "Active", value: active, sub: `${paused} paused · ${completed} completed` },
          { title: "Total Views", value: totalViews.toLocaleString(), sub: "Across all campaigns" },
          { title: "Bounty Spent", value: `₹${totalBountySpent.toLocaleString()}`, sub: `Of ₹${(totalBountySpent + totalBountyRemaining).toLocaleString()} total` },
          { title: "Remaining", value: `₹${totalBountyRemaining.toLocaleString()}`, sub: "Available for campaigns" },
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
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
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
                  <span className="text-sm font-bold">{totalSubmissions}</span>
                </div>
                <div className="flex justify-between rounded-lg border p-3">
                  <span className="text-sm">Avg Views/Submission</span>
                  <span className="text-sm font-bold">
                    {totalViews > 0
                      ? Math.round(totalViews / totalSubmissions)
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
        </motion.div>
      </div>
    </motion.div>
  )
}