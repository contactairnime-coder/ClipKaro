"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

const platforms = [
  { id: "YOUTUBE_SHORTS", label: "YouTube Shorts" },
  { id: "INSTAGRAM_REELS", label: "Instagram Reels" },
  { id: "TIKTOK", label: "TikTok" },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["INSTAGRAM_REELS", "YOUTUBE_SHORTS"])
  const [form, setForm] = useState({
    title: "",
    description: "",
    sourceVideoUrl: "",
    bountyTotal: "",
    bountyPerLakhViews: "",
    minClipDuration: "15",
    maxClipDuration: "60",
    guidelines: "",
    startDate: "",
    endDate: "",
    minPayout: "",
    maxPayout: "",
    flatFeeBonus: "",
    autoApproveHours: "48",
  })

  const bountyTotal = Number(form.bountyTotal) || 0
  const platformFee = Math.round(bountyTotal * 0.15)
  const totalCost = bountyTotal + platformFee

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          allowedPlatforms: selectedPlatforms,
          minPayout: form.minPayout || null,
          maxPayout: form.maxPayout || null,
          flatFeeBonus: form.flatFeeBonus || null,
          autoApproveHours: form.autoApproveHours || null,
        }),
      })

      if (!res.ok) throw new Error("Failed to create campaign")

      const campaign = await res.json()
      toast.success("Campaign created!")
      router.push(`/dashboard/creator/campaigns/${campaign.id}`)
    } catch {
      toast.error("Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Set up a new bounty campaign for clippers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {[
            { title: "Basic Details", content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input id="title" placeholder="e.g. Summer Fashion Collection" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe what kind of clips you want..." value={form.description} onChange={(e) => updateField("description", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceVideoUrl">Source Video URL (YouTube link to be clipped)</Label>
                  <Input id="sourceVideoUrl" type="url" placeholder="https://youtube.com/watch?v=..." value={form.sourceVideoUrl} onChange={(e) => updateField("sourceVideoUrl", e.target.value)} required />
                </div>
              </div>
            )},
            { title: "Bounty & Budget", content: (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bountyTotal">Total Bounty (₹)</Label>
                    <Input id="bountyTotal" type="number" min="0" placeholder="50000" value={form.bountyTotal} onChange={(e) => updateField("bountyTotal", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bountyPerLakhViews">Bounty per 1 Lakh Views (₹)</Label>
                    <Input id="bountyPerLakhViews" type="number" min="0" placeholder="500" value={form.bountyPerLakhViews} onChange={(e) => updateField("bountyPerLakhViews", e.target.value)} required />
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Bounty Total</span><span>₹{bountyTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Platform Fee (15%)</span><span>₹{platformFee.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold"><span>Total Cost</span><span>₹{totalCost.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="minPayout">Min Payout per Video (₹)</Label>
                    <Input id="minPayout" type="number" min="0" placeholder="e.g. 50" value={form.minPayout} onChange={(e) => updateField("minPayout", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Min earnings before submission goes for review. ₹0 = every submission reviewed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPayout">Max Payout per Video (₹)</Label>
                    <Input id="maxPayout" type="number" min="0" placeholder="e.g. 3000" value={form.maxPayout} onChange={(e) => updateField("maxPayout", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Cap per video to protect your budget</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flatFeeBonus">Flat Fee Bonus (₹)</Label>
                    <Input id="flatFeeBonus" type="number" min="0" placeholder="e.g. 100" value={form.flatFeeBonus} onChange={(e) => updateField("flatFeeBonus", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Extra bonus per approved submission</p>
                  </div>
                </div>
              </div>
            )},
            { title: "Platform Rules", content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Allowed Platforms</Label>
                  <div className="flex flex-wrap gap-4">
                    {platforms.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={selectedPlatforms.includes(p.id)} onCheckedChange={() => togglePlatform(p.id)} />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minClipDuration">Min Clip Duration (seconds)</Label>
                    <Input id="minClipDuration" type="number" min="1" value={form.minClipDuration} onChange={(e) => updateField("minClipDuration", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxClipDuration">Max Clip Duration (seconds)</Label>
                    <Input id="maxClipDuration" type="number" min="1" value={form.maxClipDuration} onChange={(e) => updateField("maxClipDuration", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guidelines">Guidelines for Clippers</Label>
                  <Textarea id="guidelines" placeholder="Any specific instructions for clippers..." value={form.guidelines} onChange={(e) => updateField("guidelines", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autoApproveHours">Auto-Approve After (hours)</Label>
                  <Input id="autoApproveHours" type="number" min="0" placeholder="48" value={form.autoApproveHours} onChange={(e) => updateField("autoApproveHours", e.target.value)} />
                  <p className="text-xs text-muted-foreground">0 = no auto-approve (manual only). Default 48 hours (Whop jaisa)</p>
                </div>
              </div>
            )},
            { title: "Schedule", content: (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} />
                </div>
              </div>
            )},
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card>
                <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Campaign (Draft)"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
