"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
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

type Submission = {
  id: string
  platform: string
  viewCount: number
  earningsCalculated: number
  lastSyncedAt: string | null
  status: string
  rejectionReason: string | null
  clipper: { id: string; name: string | null; email: string }
}

type Campaign = {
  id: string
  title: string
  description: string
  status: string
  bountyTotal: number
  remainingBounty: number
  creatorId: string
  submissions: Submission[]
}

export default function CampaignDetail() {
  const params = useParams()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found")
        return r.json()
      })
      .then((data) => setCampaign(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <div className="h-64 animate-pulse rounded bg-muted" />
  }

  if (error || !campaign) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">Campaign not found</p>
            <Link href="/dashboard/creator/campaigns">
              <Button className="mt-4">Back to campaigns</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const totalViews = campaign.submissions.reduce((s, sub) => s + sub.viewCount, 0)
  const totalPaidOut = campaign.submissions
    .filter((s) => s.status === "PAID")
    .reduce((s, sub) => s + sub.earningsCalculated, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <Link href="/dashboard/creator/campaigns" className="text-sm text-muted-foreground hover:underline">← Back to campaigns</Link>
      </div>

      <motion.div
        className="mb-6 flex items-start justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
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
      </motion.div>

      <motion.div
        className="mb-8 grid gap-4 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {[
          { title: "Budget", value: `₹${campaign.bountyTotal.toLocaleString()}` },
          { title: "Remaining", value: `₹${campaign.remainingBounty.toLocaleString()}` },
          { title: "Total Views", value: totalViews.toLocaleString() },
          { title: "Paid Out", value: `₹${totalPaidOut.toLocaleString()}` },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{stat.value}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
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
                    {campaign.submissions.map((sub, index) => (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b last:border-0"
                      >
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
                                <Button size="sm" variant="default" type="submit">Approve</Button>
                              </form>
                              <form action={`/api/submissions/${sub.id}/reject`} method="POST">
                                <Button size="sm" variant="destructive" type="submit">Reject</Button>
                              </form>
                            </div>
                          ) : sub.status === "REJECTED" && sub.rejectionReason ? (
                            <span className="text-xs text-muted-foreground">{sub.rejectionReason}</span>
                          ) : null}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}