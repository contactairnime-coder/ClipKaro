"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

type Submission = {
  id: string
  submittedUrl: string
  platform: string
  status: string
  viewCount: number
  earningsCalculated: number
  lastSyncedAt: string | null
  createdAt: string
  campaign: { id: string; title: string; bountyPerLakhViews: number }
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PAID: "bg-blue-100 text-blue-800",
}

const platformLabels: Record<string, string> = {
  YOUTUBE_SHORTS: "YouTube",
  INSTAGRAM_REELS: "Instagram",
  TIKTOK: "TikTok",
}

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshingIds, setRefreshingIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set("status", statusFilter)

    fetch(`/api/submissions/my?${params}`)
      .then((r) => r.json())
      .then((data) => setSubmissions(data.submissions || []))
      .finally(() => setLoading(false))
  }, [statusFilter])

  async function refreshViews(submissionId: string) {
    setRefreshingIds((prev) => new Set(prev).add(submissionId))
    const res = await fetch("/api/sync/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId }),
    })
    const data = await res.json()
    if (res.ok && !data.error) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, viewCount: data.viewCount, earningsCalculated: data.earningsCalculated, lastSyncedAt: new Date().toISOString() }
            : s
        )
      )
      toast.success(`Views updated: ${data.viewCount.toLocaleString()}`)
    } else {
      toast.error(data.error || "Failed to sync views")
    }
    setRefreshingIds((prev) => { const next = new Set(prev); next.delete(submissionId); return next })
  }

  const totalEarnings = submissions
    .filter((s) => s.status === "APPROVED" || s.status === "PAID")
    .reduce((sum, s) => sum + s.earningsCalculated, 0)

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Submissions</h1>
           <p className="text-sm text-muted-foreground">Track all clips you have submitted across campaigns. Refresh views and monitor earnings in real-time. ({submissions.length} total)</p>
        </div>
        <Card className="w-48">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" || !v ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </motion.div>
          ))}
        </motion.div>
      ) : submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-lg font-medium">No submissions yet</p>
              <p className="text-sm text-muted-foreground">Browse campaigns and submit your first clip.</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">URL</th>
                <th className="pb-3 font-medium">Platform</th>
                <th className="pb-3 font-medium">Views</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Earnings</th>
                <th className="pb-3 font-medium">Last Synced</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b last:border-0"
                >
                  <td className="py-3 font-medium">{sub.campaign.title}</td>
                  <td className="py-3">
                    <a href={sub.submittedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Link
                    </a>
                  </td>
                  <td className="py-3">{platformLabels[sub.platform] || sub.platform}</td>
                  <td className="py-3">{sub.viewCount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[sub.status]}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3">₹{sub.earningsCalculated.toLocaleString()}</td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {sub.lastSyncedAt ? new Date(sub.lastSyncedAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="py-3">
                    {(sub.status === "APPROVED" || sub.status === "PAID") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={refreshingIds.has(sub.id)}
                        onClick={() => refreshViews(sub.id)}
                      >
                        {refreshingIds.has(sub.id) ? "Syncing..." : "Refresh Views"}
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
