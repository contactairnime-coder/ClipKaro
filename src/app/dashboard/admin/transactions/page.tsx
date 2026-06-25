"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Transaction = {
  id: string
  type: string
  amount: number
  referenceId: string | null
  createdAt: string
  user: { id: string; name: string | null; email: string }
}

type Summary = {
  type: string
  _sum: { amount: number | null }
}

const typeLabels: Record<string, string> = {
  CREATOR_DEPOSIT: "Creator Deposit",
  PLATFORM_FEE: "Platform Fee",
  CLIPPER_EARNING: "Clipper Earning",
  WITHDRAWAL: "Withdrawal",
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (typeFilter) params.set("type", typeFilter)
    const qs = params.toString()

    fetch(`/api/admin/transactions${qs ? `?${qs}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions || [])
        setSummary(data.summary || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [typeFilter])

  const totalRevenue = summary.find((s) => s.type === "PLATFORM_FEE")?._sum.amount || 0
  const totalPayouts = summary.find((s) => s.type === "WITHDRAWAL")?._sum.amount || 0
  const totalEarnings = summary.find((s) => s.type === "CLIPPER_EARNING")?._sum.amount || 0

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">Complete financial log — creator deposits, platform fees, clipper earnings, and withdrawal requests across the platform.</p>
      </div>

      <motion.div className="mb-6 grid gap-4 md:grid-cols-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.4 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Platform Revenue</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Clipper Earnings</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Withdrawals</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-red-600">₹{totalPayouts.toLocaleString()}</p></CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mb-4">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === "all" || !v ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="CREATOR_DEPOSIT">Creator Deposit</SelectItem>
            <SelectItem value="PLATFORM_FEE">Platform Fee</SelectItem>
            <SelectItem value="CLIPPER_EARNING">Clipper Earning</SelectItem>
            <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {transactions.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No transactions found</CardContent></Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <motion.tr key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="border-b last:border-0">
                  <td className="py-3">{typeLabels[tx.type] || tx.type}</td>
                  <td className="py-3">{tx.user.name || tx.user.email}</td>
                  <td className="py-3 font-medium">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-3 text-muted-foreground">{tx.referenceId ? tx.referenceId.slice(0, 12) + "..." : "—"}</td>
                  <td className="py-3 text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
