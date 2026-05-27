"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Campaign = {
  id: string
  title: string
  description: string
  sourceVideoUrl: string
  bountyPerLakhViews: number
  bountyTotal: number
  remainingBounty: number
  platformFee: number
  allowedPlatforms: string[]
  minClipDuration: number
  maxClipDuration: number
  guidelines: string | null
  status: string
  creator: {
    name: string | null
    creatorProfile: { channelName: string | null; followerCount: number } | null
  }
  _count: { submissions: number }
}

type Submission = {
  id: string
  submittedUrl: string
  platform: string
  status: string
  viewCount: number
  earningsCalculated: number
  createdAt: string
}

const platformLabels: Record<string, string> = {
  YOUTUBE_SHORTS: "YouTube Shorts",
  INSTAGRAM_REELS: "Instagram Reels",
  TIKTOK: "TikTok",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submittedUrl, setSubmittedUrl] = useState("")
  const [platform, setPlatform] = useState("")

  useEffect(() => {
    async function load() {
      const [campRes, subRes] = await Promise.all([
        fetch(`/api/campaigns/${params.id}`),
        fetch(`/api/submissions/my?campaignId=${params.id}`),
      ])
      if (campRes.ok) setCampaign(await campRes.json())
      if (subRes.ok) setMySubmissions(await subRes.json())
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!submittedUrl || !platform) {
      toast.error("Fill in all fields")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: params.id, submittedUrl, platform }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      toast.success("Clip submitted!")
      setSubmittedUrl("")
      setPlatform("")

      const subRes = await fetch(`/api/submissions/my?campaignId=${params.id}`)
      if (subRes.ok) setMySubmissions(await subRes.json())
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-lg font-medium">Campaign not found</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/clipper")}>Browse campaigns</Button>
        </CardContent>
      </Card>
    )
  }

  const videoId = campaign.sourceVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1]

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" className="mb-4 -ml-3" onClick={() => router.push("/dashboard/clipper")}>
        ← Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {videoId ? (
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="h-full w-full rounded-t-lg"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <p className="text-4xl font-bold text-primary">₹{campaign.bountyPerLakhViews}</p>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by {campaign.creator.creatorProfile?.channelName || campaign.creator.name || "Unknown"}
                  </p>
                </div>
                <Badge>{campaign.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{campaign.description}</p>
              {campaign.guidelines && (
                <div>
                  <p className="mb-1 text-sm font-medium">Guidelines</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{campaign.guidelines}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {campaign.allowedPlatforms.map((p) => (
                  <Badge key={p} variant="secondary">{platformLabels[p] || p}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                ⏱ {campaign.minClipDuration}-{campaign.maxClipDuration}s clips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Submit Your Clip</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clip URL</label>
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={submittedUrl}
                    onChange={(e) => setSubmittedUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={(v) => v && setPlatform(v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaign.allowedPlatforms.map((p) => (
                        <SelectItem key={p} value={p}>{platformLabels[p] || p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Clip"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Bounty per 1L Views</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">₹{campaign.bountyPerLakhViews}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Remaining</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₹{campaign.remainingBounty.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Total Budget</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">₹{campaign.bountyTotal.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Submissions</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{campaign._count.submissions}</p></CardContent>
          </Card>

          {mySubmissions.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">My Submissions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="rounded-lg border p-2 text-xs">
                    <p className="truncate font-medium">{sub.submittedUrl}</p>
                    <div className="mt-1 flex justify-between text-muted-foreground">
                      <span>{platformLabels[sub.platform] || sub.platform}</span>
                      <Badge variant="outline" className="text-[10px]">{sub.status}</Badge>
                    </div>
                    <div className="mt-1 flex justify-between text-muted-foreground">
                      <span>{sub.viewCount} views</span>
                      <span>₹{sub.earningsCalculated}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
