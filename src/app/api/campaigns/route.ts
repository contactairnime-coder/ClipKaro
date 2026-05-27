import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const sort = searchParams.get("sort")
    const search = searchParams.get("search")

    const where: Prisma.CampaignWhereInput = { status: "ACTIVE" }

    if (platform) {
      where.allowedPlatforms = { has: platform }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const orderBy: Prisma.CampaignOrderByWithRelationInput = sort === "bounty_high"
      ? { bountyPerLakhViews: "desc" }
      : { createdAt: "desc" }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            creatorProfile: { select: { channelName: true, instagramHandle: true } },
          },
        },
        _count: { select: { submissions: true } },
      },
      orderBy,
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await prisma.profile.findUnique({ where: { id: user.id } })
    if (!profile || profile.role !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can create campaigns" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, sourceVideoUrl, bountyTotal, bountyPerLakhViews, allowedPlatforms, minClipDuration, maxClipDuration, guidelines, startDate, endDate } = body

    const platformFee = Math.round(bountyTotal * 0.15)

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        sourceVideoUrl,
        bountyTotal: Number(bountyTotal),
        bountyPerLakhViews: Number(bountyPerLakhViews),
        platformFee,
        remainingBounty: Number(bountyTotal),
        status: "DRAFT",
        allowedPlatforms: allowedPlatforms || [],
        minClipDuration: Number(minClipDuration) || 15,
        maxClipDuration: Number(maxClipDuration) || 60,
        guidelines: guidelines || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        creatorId: user.id,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
