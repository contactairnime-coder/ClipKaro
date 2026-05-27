"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [upiId, setUpiId] = useState("")
  const [role, setRole] = useState<"CREATOR" | "CLIPPER">("CLIPPER")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, upiId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save profile")
      }
      toast.success("Profile created!")
      router.push("/dashboard")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Set up your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">I want to join as</label>
            <Tabs defaultValue={role} onValueChange={(v) => setRole(v as "CREATOR" | "CLIPPER")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="CLIPPER">Clipper</TabsTrigger>
                <TabsTrigger value="CREATOR">Creator</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">UPI ID (optional)</label>
              <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@paytm" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
