"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type Stats = {
  creators: number
  clippers: number
  activeCampaigns: number
  submissionsToday: number
  viewsToday: number
  platformRevenue: number
  pendingPayouts: number
  totalBountyInEscrow: number
}

type Activity = {
  profiles: Array<{ id: string; name: string | null; email: string; role: string; createdAt: string }>
  campaigns: Array<{ id: string; title: string; status: string; createdAt: string; creator: { name: string | null } }>
  submissions: Array<{ id: string; status: string; createdAt: string; campaign: { title: string }; clipper: { name: string | null } }>
  fraudFlags: Array<{ id: string; createdAt: string; submission: { id: string } }>
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats)
        setActivity(data.activity)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-96 animate-pulse rounded bg-muted" />

  const statCards = [
    { label: "Total Creators", value: stats?.creators || 0 },
    { label: "Total Clippers", value: stats?.clippers || 0 },
    { label: "Active Campaigns", value: stats?.activeCampaigns || 0 },
    { label: "Submissions Today", value: stats?.submissionsToday || 0 },
    { label: "Views Today", value: (stats?.viewsToday || 0).toLocaleString() },
    { label: "Platform Revenue", value: `₹${(stats?.platformRevenue || 0).toLocaleString()}` },
    { label: "Pending Payouts", value: `₹${(stats?.pendingPayouts || 0).toLocaleString()}` },
    { label: "Bounty in Escrow", value: `₹${(stats?.totalBountyInEscrow || 0).toLocaleString()}` },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Platform-wide statistics, user growth, revenue, and system health at a glance.</p>
      </div>

      <motion.div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {statCards.map((s, index) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mb-8">
        <Card>
          <CardHeader><CardTitle className="text-lg">View Sync</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Sync view counts for all approved submissions from YouTube, Instagram, and TikTok.
            </p>
            <Button
              disabled={syncing}
              onClick={async () => {
                setSyncing(true)
                try {
                  const res = await fetch("/api/admin/sync-all-views", { method: "POST" })
                  const data = await res.json().catch(() => ({}))
                  if (res.ok) {
                    toast.success(`Synced ${data.syncedCount} submissions, ${(data.totalViews || 0).toLocaleString()} views`)
                  } else {
                    toast.error(data.error || "Failed to sync")
                  }
                } catch {
                  toast.error("Failed to sync views")
                } finally {
                  setSyncing(false)
                }
              }}
            >
              {syncing ? "Syncing..." : "Sync All Views Now"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <motion.div className="grid gap-6 lg:grid-cols-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Signups</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activity?.profiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span className="font-medium">{p.name || p.email}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {activity?.profiles.length === 0 && <p className="text-sm text-muted-foreground">No recent signups</p>}
            </div>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Campaigns</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activity?.campaigns.map((c) => (
                <div key={c.id} className="rounded-lg border p-2 text-sm">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">by {c.creator.name || "Unknown"} · {c.status}</p>
                </div>
              ))}
              {activity?.campaigns.length === 0 && <p className="text-sm text-muted-foreground">No recent campaigns</p>}
            </div>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Submissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activity?.submissions.map((s) => (
                <div key={s.id} className="rounded-lg border p-2 text-sm">
                  <p className="font-medium">{s.clipper.name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">{s.campaign.title} · {s.status}</p>
                </div>
              ))}
              {activity?.submissions.length === 0 && <p className="text-sm text-muted-foreground">No recent submissions</p>}
            </div>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Open Fraud Flags</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activity?.fraudFlags.map((f) => (
                <div key={f.id} className="rounded-lg border border-red-200 p-2 text-sm">
                  <p className="font-medium text-red-600">Flag #{f.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {activity?.fraudFlags.length === 0 && <p className="text-sm text-muted-foreground">No open fraud flags 🎉</p>}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
