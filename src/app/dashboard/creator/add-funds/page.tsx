"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type RazorpayConfig = {
  key: string | undefined
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { contact: string; email: string }
  theme: { color: string }
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void
  modal: { ondismiss: () => void }
}

type RazorpayInstance = {
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void
  open: () => void
}

declare global {
  interface Window {
    Razorpay: new (config: RazorpayConfig) => RazorpayInstance
  }
}

type Transaction = {
  id: string
  type: string
  amount: number
  referenceId: string | null
  createdAt: string
}

export default function AddFundsPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (document.getElementById("razorpay-checkout-script")) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.id = "razorpay-checkout-script"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setBalance(data.profile?.totalEarned || 0)
      })

    fetch("/api/user/profile/transactions")
      .then((r) => r.json())
      .then((data) => setTransactions(data.transactions || []))
      .finally(() => setLoading(false))
  }, [])

  const handlePayment = useCallback(async () => {
    const numAmount = Number(amount)
    if (!numAmount || numAmount < 1000) {
      toast.error("Minimum deposit is ₹1,000")
      return
    }
    if (!scriptLoaded) {
      toast.error("Payment gateway loading. Please try again.")
      return
    }

    setProcessing(true)
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount, campaignId: null }),
      })
      if (!orderRes.ok) {
        const err = await orderRes.json()
        toast.error(err.error || "Failed to create order")
        return
      }
      const order = await orderRes.json()

      const options: RazorpayConfig = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ClipKaro",
        description: `Add ₹${numAmount.toLocaleString()} wallet balance`,
        order_id: order.orderId,
        prefill: { contact: "", email: "" },
        theme: { color: "#6366f1" },
        handler: async function (response) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              campaignId: null,
              bountyAmount: order.bountyAmount,
              platformFee: order.platformFee,
            }),
          })
          if (verifyRes.ok) {
            toast.success(`₹${numAmount.toLocaleString()} added successfully!`)
            setBalance((prev) => prev + numAmount)
            setAmount("")
            router.refresh()
          } else {
            toast.error("Payment verification failed. Contact support.")
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`)
        setProcessing(false)
      })
      rzp.open()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setProcessing(false)
    }
  }, [amount, scriptLoaded, router])

  const presetAmounts = [5000, 10000, 20000, 50000]

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Funds</h1>
        <p className="text-muted-foreground">Add money to your ClipKaro wallet for campaign bounties</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Current Balance</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹{balance.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted-foreground">Available for campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Add Money</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Enter Amount (₹)</label>
              <Input
                type="number"
                min={1000}
                step={100}
                placeholder="Enter amount (min ₹1,000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(String(preset))}
                >
                  ₹{preset.toLocaleString()}
                </Button>
              ))}
            </div>
            {amount && Number(amount) >= 1000 && (
              <div className="mb-4 rounded-lg bg-muted p-3 text-sm">
                <div className="flex justify-between">
                  <span>Bounty Amount</span>
                  <span>₹{Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee (15%)</span>
                  <span>₹{Math.round(Number(amount) * 0.15).toLocaleString()}</span>
                </div>
                <div className="mt-1 flex justify-between font-semibold border-t pt-1">
                  <span>Total</span>
                  <span>₹{(Number(amount) + Math.round(Number(amount) * 0.15)).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button
              className="w-full"
              size="lg"
              disabled={processing || !amount || Number(amount) < 1000 || !scriptLoaded}
              onClick={handlePayment}
            >
              {processing ? "Processing..." : "Pay with Razorpay"}
            </Button>
            {!scriptLoaded && (
              <p className="mt-2 text-xs text-muted-foreground">Loading payment gateway...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="py-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">{tx.type.replace(/_/g, " ")}</td>
                      <td className="py-3">₹{tx.amount.toLocaleString()}</td>
                      <td className="py-3 text-muted-foreground">{tx.referenceId ? tx.referenceId.slice(0, 8) + "..." : "-"}</td>
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
