"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type EarningsData = {
  totalEarned: number
  totalWithdrawn: number
  pendingEarnings: number
  paidEarnings: number
  history: Array<{
    id: string
    campaign: { title: string }
    viewCount: number
    earningsCalculated: number
    status: string
    createdAt: string
  }>
}

type Payout = {
  id: string
  amount: number
  upiId: string
  status: string
  createdAt: string
}

const payoutStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
}

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawUpi, setWithdrawUpi] = useState("")
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    async function load() {
      const [earnRes, payoutsRes] = await Promise.all([
        fetch("/api/earnings/my"),
        fetch("/api/earnings/withdraw/history"),
      ])
      if (earnRes.ok) setData(await earnRes.json())
      if (payoutsRes.ok) setPayouts(await payoutsRes.json())
      setLoading(false)
    }
    load()
  }, [])

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    if (!withdrawAmount || Number(withdrawAmount) < 500) {
      toast.error("Minimum withdrawal is ₹500")
      return
    }
    if (!withdrawUpi) {
      toast.error("Enter your UPI ID")
      return
    }

    setWithdrawing(true)
    try {
      const res = await fetch("/api/earnings/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(withdrawAmount), upiId: withdrawUpi }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      toast.success("Withdrawal request submitted!")
      setWithdrawAmount("")
      const earnRes = await fetch("/api/earnings/my")
      if (earnRes.ok) setData(await earnRes.json())
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Withdrawal failed")
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded bg-muted" />
  }

  const availableBalance = (data?.totalEarned || 0) - (data?.totalWithdrawn || 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your earnings and request payouts</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Earned</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{(data?.totalEarned || 0).toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Available Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">₹{availableBalance.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-yellow-600">₹{(data?.pendingEarnings || 0).toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Withdrawn</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{(data?.totalWithdrawn || 0).toLocaleString()}</p></CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Withdraw Funds</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">UPI ID</label>
                <Input
                  placeholder="yourname@paytm"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  min="500"
                  max={availableBalance}
                  placeholder="Min. ₹500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={withdrawing || availableBalance < 500}>
                {withdrawing ? "Processing..." : "Withdraw"}
              </Button>
              {availableBalance < 500 && (
                <p className="text-xs text-destructive">Minimum balance of ₹500 required for withdrawal</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Withdrawal History</CardTitle></CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No withdrawals yet</p>
            ) : (
              <div className="space-y-2">
                {payouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">₹{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{p.upiId}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${payoutStatusColors[p.status]}`}>{p.status}</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Earnings History</CardTitle></CardHeader>
        <CardContent>
          {data?.history.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No earnings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Campaign</th>
                    <th className="pb-3 font-medium">Views</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.history.map((h) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-3">{h.campaign.title}</td>
                      <td className="py-3">{h.viewCount.toLocaleString()}</td>
                      <td className="py-3">₹{h.earningsCalculated}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${payoutStatusColors[h.status] || ""}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{new Date(h.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
