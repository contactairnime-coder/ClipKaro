"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Campaign = {
  id: string
  title: string
  description: string
  bountyTotal: number
  platformFee: number
  status: string
  createdAt: string
  creator: { id: string; name: string | null; email: string }
  _count: { submissions: number }
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

export default function AdminCampaigns() {
  const [pending, setPending] = useState<Campaign[]>([])
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [p, a] = await Promise.all([
      fetch("/api/admin/campaigns/pending").then((r) => r.json()),
      fetch("/api/admin/campaigns/all").then((r) => r.json()),
    ])
    if (Array.isArray(p)) setPending(p)
    if (Array.isArray(a)) setAllCampaigns(a)
  }, [])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  async function approveCampaign(id: string) {
    const res = await fetch(`/api/admin/campaigns/${id}/approve`, { method: "POST" })
    if (res.ok) {
      toast.success("Campaign approved!")
      setPending((prev) => prev.filter((c) => c.id !== id))
      fetchData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || "Failed to approve")
    }
  }

  async function rejectCampaign(id: string) {
    const res = await fetch(`/api/admin/campaigns/${id}/reject`, { method: "POST" })
    if (res.ok) {
      toast.success("Campaign rejected")
      setPending((prev) => prev.filter((c) => c.id !== id))
      fetchData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || "Failed to reject")
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Campaign Approvals</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Approval ({pending.length})</TabsTrigger>
          <TabsTrigger value="all">All Campaigns ({allCampaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No pending campaigns</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {pending.map((c) => (
                <Card key={c.id}>
                  <CardContent className="flex items-start justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">by {c.creator.name || c.creator.email}</p>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span>Budget: ₹{c.bountyTotal.toLocaleString()}</span>
                        <span>Fee: ₹{c.platformFee.toLocaleString()}</span>
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveCampaign(c.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectCampaign(c.id)}>Reject</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {allCampaigns.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No campaigns yet</CardContent></Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Creator</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Submissions</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allCampaigns.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{c.title}</td>
                      <td className="py-3">{c.creator.name || c.creator.email}</td>
                      <td className="py-3">₹{c.bountyTotal.toLocaleString()}</td>
                      <td className="py-3">
                        <Badge className={statusColors[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="py-3">{c._count.submissions}</td>
                      <td className="py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
