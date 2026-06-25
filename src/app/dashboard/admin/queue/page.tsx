"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type QueueStats = {
  name: string
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  recentFailures: Array<{
    id: string
    data: Record<string, unknown>
    failedReason: string
    timestamp: number
  }>
}

type QueueData = {
  queues: Record<string, QueueStats>
  totalFailed: number
}

export default function AdminQueue() {
  const [data, setData] = useState<QueueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/queue/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const queueColors: Record<string, string> = {
    viewSync: "bg-blue-100 text-blue-800",
    fraudCheck: "bg-purple-100 text-purple-800",
    earnings: "bg-green-100 text-green-800",
    email: "bg-yellow-100 text-yellow-800",
    payout: "bg-red-100 text-red-800",
  }

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  if (!data) return <p>Failed to load queue stats</p>

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queue Monitor</h1>
          <p className="text-sm text-muted-foreground">Background job queues for view syncing, fraud checks, earnings calculations, email delivery, and payouts.</p>
          <p className="text-muted-foreground">
            {data.totalFailed > 0 ? (
              <span className="text-red-600 font-medium">{data.totalFailed} failed jobs</span>
            ) : (
              "All queues healthy"
            )}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      <motion.div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {Object.entries(data.queues).map(([key, queue], index) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
            <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</CardTitle>
                <Badge className={queueColors[key] || "bg-gray-100"}>{queue.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-2xl font-bold">{queue.waiting}</p>
                  <p className="text-xs text-muted-foreground">Waiting</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{queue.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{queue.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{queue.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{queue.delayed}</p>
                  <p className="text-xs text-muted-foreground">Delayed</p>
                </div>
              </div>

              {queue.recentFailures.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs font-medium text-red-600">Recent Failures:</p>
                  <div className="space-y-1">
                    {queue.recentFailures.slice(0, 3).map((f) => (
                      <div key={f.id} className="rounded bg-red-50 p-1.5 text-xs">
                        <p className="font-mono text-[10px] text-red-800 truncate">{f.failedReason}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Job {f.id} · {new Date(f.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
