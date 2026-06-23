"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Payout = {
  id: string
  amount: number
  upiId: string
  status: string
  createdAt: string
  paidAt: string | null
  clipper: { id: string; name: string | null; email: string }
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
}

export default function AdminPayouts() {
  const [pending, setPending] = useState<Payout[]>([])
  const [history, setHistory] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/payouts/pending").then((r) => r.json()).catch(() => ({ payouts: [] })),
      fetch("/api/admin/payouts/all").then((r) => r.json()).catch(() => ({ payouts: [] })),
    ]).then(([p, h]) => {
      setPending(p.payouts || [])
      setHistory(h.payouts || [])
    }).finally(() => setLoading(false))
  }, [])

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  async function approvePayout(id: string) {
    const res = await fetch(`/api/admin/payouts/${id}/approve`, { method: "POST" })
    if (res.ok) {
      toast.success("Payout approved!")
      setPending((prev) => prev.filter((p) => p.id !== id))
    } else {
      toast.error("Failed to approve payout")
    }
  }

  async function processRazorpayPayout(id: string) {
    setProcessingIds((prev) => new Set(prev).add(id))
    const res = await fetch(`/api/admin/payouts/${id}/process`, { method: "POST" })
    if (res.ok) {
      toast.success("Payout sent via Razorpay!")
      setPending((prev) => prev.filter((p) => p.id !== id))
    } else {
      const err = await res.json()
      toast.error(err.error || "Razorpay payout failed")
    }
    setProcessingIds((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payout Management</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No pending payouts</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {pending.map((p, index) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                  <Card>
                    <CardContent className="flex items-start justify-between p-4">
                    <div>
                      <p className="font-semibold">{p.clipper.name || p.clipper.email}</p>
                      <p className="text-sm text-muted-foreground">₹{p.amount.toLocaleString()} → {p.upiId}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => processRazorpayPayout(p.id)} disabled={processingIds.has(p.id)}>
                        {processingIds.has(p.id) ? "Processing..." : "Pay via Razorpay"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => approvePayout(p.id)}>Mark Paid</Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {history.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No payout history</CardContent></Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Clipper</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">UPI</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((p, index) => (
                    <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="border-b last:border-0">
                      <td className="py-3">{p.clipper?.name || p.clipper?.email || "—"}</td>
                      <td className="py-3">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3">{p.upiId}</td>
                      <td className="py-3">
                        <Badge className={statusColors[p.status]}>{p.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </motion.tr>
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
