"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, IndianRupee, Video } from "lucide-react"

type Campaign = {
  id: string
  title: string
  description: string
  sourceVideoUrl: string
  bountyPerLakhViews: number
  remainingBounty: number
  bountyTotal: number
  allowedPlatforms: string[]
  minClipDuration: number
  maxClipDuration: number
  creator: {
    name: string | null
    creatorProfile: { channelName: string | null; instagramHandle: string | null } | null
  }
  _count: { submissions: number }
}

const platformIcons: Record<string, string> = {
  YOUTUBE_SHORTS: "YT",
  INSTAGRAM_REELS: "IG",
  TIKTOK: "TK",
}

export default function BrowseCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState("")
  const [sortBy, setSortBy] = useState("latest")

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (platformFilter) params.set("platform", platformFilter)
    if (sortBy) params.set("sort", sortBy === "bounty_high" ? "bounty_high" : "latest")

    fetch(`/api/campaigns?${params}`)
      .then((r) => r.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .finally(() => setLoading(false))
  }, [search, platformFilter, sortBy])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Browse Campaigns</h1>
        <p className="text-muted-foreground">Find campaigns and start clipping</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />
        <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v === "all" || !v ? "" : v)}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="YOUTUBE_SHORTS">YouTube Shorts</SelectItem>
            <SelectItem value="INSTAGRAM_REELS">Instagram Reels</SelectItem>
            <SelectItem value="TIKTOK">TikTok</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="bounty_high">Bounty: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card>
                <CardContent className="h-48 animate-pulse bg-muted/50" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : campaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-lg font-medium">No campaigns found</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back later for new opportunities.</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="flex flex-col">
                <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <p className="text-3xl font-bold text-primary">₹{campaign.bountyPerLakhViews}</p>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{campaign.title}</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    by {campaign.creator.creatorProfile?.channelName || campaign.creator.name || "Unknown"}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{campaign.description}</p>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {campaign.allowedPlatforms.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {platformIcons[p] || p}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> {campaign.minClipDuration}-{campaign.maxClipDuration}s</p>
                    <p className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> ₹{campaign.remainingBounty.toLocaleString()} remaining</p>
                    <p className="flex items-center gap-1"><Video className="w-4 h-4" /> {campaign._count.submissions} submissions</p>
                  </div>
                  <Link href={`/dashboard/clipper/campaigns/${campaign.id}`}>
                    <Button className="w-full" size="sm">View Campaign</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
