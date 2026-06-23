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

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    const campaigns = await prisma.campaign.findMany({
      where,
      skip,
      take: limit,
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

    const total = await prisma.campaign.count({ where })

    return NextResponse.json({ campaigns, pagination: { page, limit, total } })
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
    const { title, description, sourceVideoUrl, bountyTotal, bountyPerLakhViews, allowedPlatforms, minClipDuration, maxClipDuration, guidelines, startDate, endDate, minPayout, maxPayout, flatFeeBonus, autoApproveHours } = body

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
        minPayout: minPayout ? Number(minPayout) : null,
        maxPayout: maxPayout ? Number(maxPayout) : null,
        flatFeeBonus: flatFeeBonus ? Number(flatFeeBonus) : null,
        autoApproveHours: autoApproveHours ? Number(autoApproveHours) : 48,
        creatorId: user.id,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
